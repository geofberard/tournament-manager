import {
  Alert,
  Button,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useCallback, useState } from 'react'
import { useSWRConfig } from 'swr'
import { AdminGamesTable } from '../../components/admin/AdminGamesTable'
import { ManageGameForm } from '../../components/admin/ManageGameForm'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { usePhases } from '../../hooks/usePhases'
import { useTeams } from '../../hooks/useTeams'
import {
  createGame,
  updateGame,
  upsertGameScore,
  type Game,
  type GamePayload,
} from '../../services/gamesService'

type GameDrawerMode = 'idle' | 'create' | 'update'

const emptyGameForm = (): GamePayload => ({
  contestantIds: new Set(),
  court: '',
  group: '',
  name: '',
  phaseId: '',
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
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const saveGameScore = useCallback(
    async (game: Game, pointsByTeam: Record<string, number>) => {
      const score = await upsertGameScore(game.id, pointsByTeam)
      const completedGame =
        game.status === GameStatus.Completed
          ? game
          : await updateGame(game.id, {
              ...toGamePayload(game),
              status: GameStatus.Completed,
            })

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

  const saveCreatedGame = async (gamePayload: GamePayload) => {
    const newGame = await createGame(gamePayload)
    await mutate('/api/games', (currentGames: Game[] | undefined) => [...(currentGames ?? []), newGame], {
      revalidate: false,
    })
    closeDrawer()
  }

  const saveUpdatedGame = async (gamePayload: GamePayload) => {
    if (!selectedGame) {
      return
    }

    const updatedGame = await updateGame(selectedGame.id, gamePayload)
    await mutate(
      '/api/games',
      (currentGames: Game[] | undefined) =>
        (currentGames ?? []).map((game) => (game.id === updatedGame.id ? updatedGame : game)),
      { revalidate: false },
    )
    closeDrawer()
  }

  return (
    <Stack spacing={3}>
      <Stack alignItems={{ xs: 'stretch', sm: 'flex-start' }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography variant="h1">Matchs</Typography>
          <Typography color="text.secondary">
            Liste des matchs du tournoi avec toutes les informations actuellement exposees par l&apos;API.
          </Typography>
        </Stack>
        <Button disabled={phases.length === 0 || teams.length < 2} onClick={openCreateDrawer} variant="contained">
          Ajouter un match
        </Button>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <AdminGamesTable games={games} onGameClick={openUpdateDrawer} onScoreSave={saveGameScore} />
      )}

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
      </Drawer>
    </Stack>
  )
}
