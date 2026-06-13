import {
  Alert,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'
import { AdminCreateFab } from '../../components/admin/AdminCreateFab'
import { AdminGamesTable } from '../../components/admin/AdminGamesTable'
import { BulkUpdateGamesForm } from '../../components/admin/BulkUpdateGamesForm'
import { ManageGameForm } from '../../components/admin/ManageGameForm'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { usePhases } from '../../hooks/usePhases'
import { useTeams } from '../../hooks/useTeams'
import {
  bulkUpdateGames,
  createGame,
  deleteGame,
  deleteGameScore,
  updateGame,
  upsertGameScore,
  type Game,
  type BulkGameChanges,
  type GamePayload,
} from '../../services/gamesService'

type GameDrawerMode = 'idle' | 'bulk-update' | 'create' | 'update'

const emptyGameForm = (): GamePayload => ({
  contestantIds: new Set(),
  court: '',
  group: '',
  name: '',
  phaseId: '',
  pointsByTeam: null,
  refereeId: undefined,
  status: GameStatus.Scheduled,
  time: new Date(),
})

const toGamePayload = (game: Game): GamePayload => ({
  contestantIds: new Set(Array.from(game.contestants, (team) => team.id)),
  court: game.court,
  group: game.group,
  name: game.name,
  phaseId: game.phase.id,
  pointsByTeam:
    game.score?.pointsByTeam && Object.keys(game.score.pointsByTeam).length > 0
      ? { ...game.score.pointsByTeam }
      : null,
  refereeId: game.referee?.id,
  status: game.status,
  time: game.time,
})

export const AdminGamesView = () => {
  const { games, isLoading, errorMessage } = useGames()
  const { phases } = usePhases()
  const { teams } = useTeams()
  const { mutate } = useSWRConfig()
  const [drawerMode, setDrawerMode] = useState<GameDrawerMode>('idle')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedGameIds, setSelectedGameIds] = useState<Set<string>>(new Set())
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const saveGameScore = useCallback(
    async (game: Game, pointsByTeam: Record<string, number>) => {
      const completedGame =
        game.status === GameStatus.Completed
          ? game
          : await updateGame(game.id, {
              ...toGamePayload(game),
              status: GameStatus.Completed,
            })
      const score = await upsertGameScore(game.id, pointsByTeam)

      await mutate(
        '/api/games',
        (currentGames: Game[] | undefined) =>
          (currentGames ?? []).map((currentGame) =>
            currentGame.id === game.id
              ? {
                  ...completedGame,
                  score,
                  status: GameStatus.Completed,
                }
              : currentGame,
          ),
        { revalidate: false },
      )
    },
    [mutate],
  )

  const closeDrawer = () => {
    setDrawerMode('idle')
    setSelectedGame(null)
  }

  const openCreateDrawer = () => {
    setSelectedGame(null)
    setDrawerMode('create')
  }

  const openUpdateDrawer = (game: Game) => {
    setSelectedGame(game)
    setDrawerMode('update')
  }

  const openBulkUpdateDrawer = () => {
    setSelectedGame(null)
    setDrawerMode('bulk-update')
  }

  const saveCreatedGame = async (gamePayload: GamePayload) => {
    const newGame = await createGame(gamePayload)
    const score = gamePayload.pointsByTeam
      ? await upsertGameScore(newGame.id, gamePayload.pointsByTeam)
      : null
    const createdGame = score
      ? { ...newGame, score, status: GameStatus.InProgress }
      : newGame

    await mutate(
      '/api/games',
      (currentGames: Game[] | undefined) => [...(currentGames ?? []), createdGame],
      { revalidate: false },
    )
    closeDrawer()
  }

  const saveUpdatedGame = async (gamePayload: GamePayload) => {
    if (!selectedGame) {
      return
    }

    const updatedGame = await updateGame(selectedGame.id, gamePayload)
    let score = updatedGame.score

    if (gamePayload.pointsByTeam) {
      score = await upsertGameScore(selectedGame.id, gamePayload.pointsByTeam)
    } else if (selectedGame.score?.pointsByTeam && Object.keys(selectedGame.score.pointsByTeam).length > 0) {
      await deleteGameScore(selectedGame.id)
      score = { pointsByTeam: {} }
    }

    const gameWithScore = {
      ...updatedGame,
      score,
      status:
        gamePayload.pointsByTeam && updatedGame.status !== GameStatus.Completed
          ? GameStatus.InProgress
          : updatedGame.status,
    }

    await mutate(
      '/api/games',
      (currentGames: Game[] | undefined) =>
        (currentGames ?? []).map((game) => (game.id === gameWithScore.id ? gameWithScore : game)),
      { revalidate: false },
    )
    closeDrawer()
  }

  const saveBulkUpdatedGames = async (changes: BulkGameChanges) => {
    const updatedGames = await bulkUpdateGames(selectedGameIds, changes)
    const updatedGamesById = new Map(updatedGames.map((game) => [game.id, game]))

    await mutate(
      '/api/games',
      (currentGames: Game[] | undefined) =>
        (currentGames ?? []).map((game) => updatedGamesById.get(game.id) ?? game),
      { revalidate: false },
    )
    setSelectedGameIds(new Set())
    closeDrawer()
  }

  const deleteSelectedGames = async () => {
    const gameIds = Array.from(selectedGameIds)
    const deletionResults = await Promise.allSettled(gameIds.map((gameId) => deleteGame(gameId)))
    const deletedGameIds = new Set(
      gameIds.filter((_gameId, index) => deletionResults[index].status === 'fulfilled'),
    )
    const failedGameIds = new Set(
      gameIds.filter((_gameId, index) => deletionResults[index].status === 'rejected'),
    )

    if (deletedGameIds.size > 0) {
      await mutate(
        '/api/games',
        (currentGames: Game[] | undefined) =>
          (currentGames ?? []).filter((game) => !deletedGameIds.has(game.id)),
        { revalidate: false },
      )
    }

    setSelectedGameIds(failedGameIds)

    if (selectedGame && deletedGameIds.has(selectedGame.id)) {
      closeDrawer()
    }

    if (failedGameIds.size > 0) {
      throw new Error('Some games could not be deleted')
    }
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h1">Matchs</Typography>
        <Typography color="text.secondary">
          Liste des matchs du tournoi avec toutes les informations actuellement exposees par l&apos;API.
        </Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <AdminGamesTable
          games={games}
          onBulkDelete={deleteSelectedGames}
          onBulkEdit={openBulkUpdateDrawer}
          onGameClick={openUpdateDrawer}
          onScoreSave={saveGameScore}
          onSelectionChange={setSelectedGameIds}
          selectedGameIds={selectedGameIds}
        />
      )}

      <AdminCreateFab
        disabled={phases.length === 0 || teams.length < 2}
        label="Ajouter un match"
        onClick={openCreateDrawer}
      />

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        onClose={closeDrawer}
        open={drawerMode !== 'idle'}
        PaperProps={{
          sx: {
            borderTopLeftRadius: { xs: 8, sm: 0 },
            borderTopRightRadius: { xs: 8, sm: 0 },
            height: { xs: '88vh', sm: '100%' },
            width: { xs: '100%', sm: 520 },
          },
        }}
      >
        {drawerMode === 'create' ? (
          <ManageGameForm
            initialValue={emptyGameForm()}
            isUpdate={false}
            onClose={closeDrawer}
            onSubmit={saveCreatedGame}
            phases={phases}
            teams={teams}
            titleLabel="Nouveau match"
          />
        ) : null}
        {drawerMode === 'update' && selectedGame ? (
          <ManageGameForm
            initialValue={toGamePayload(selectedGame)}
            isUpdate
            onClose={closeDrawer}
            onSubmit={saveUpdatedGame}
            phases={phases}
            teams={teams}
            titleLabel="Modifier le match"
          />
        ) : null}
        {drawerMode === 'bulk-update' ? (
          <BulkUpdateGamesForm
            gameCount={selectedGameIds.size}
            onClose={closeDrawer}
            onSubmit={saveBulkUpdatedGames}
            phases={phases}
            teams={teams}
          />
        ) : null}
      </Drawer>
    </Stack>
  )
}
