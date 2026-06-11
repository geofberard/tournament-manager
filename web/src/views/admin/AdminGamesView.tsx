import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { useSWRConfig } from 'swr'
import { ManageGameForm } from '../../components/admin/ManageGameForm'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { usePhases } from '../../hooks/usePhases'
import { useTeams } from '../../hooks/useTeams'
import { createGame, updateGame, type Game, type GamePayload } from '../../services/gamesService'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

type AdminGameRow = {
  court: string
  game: Game
  group: string
  id: string
  name: string
  phase: string
  referee: string
  score: string
  status: string
  team1: string
  team2: string
  teams: string
  time: Date
}

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

const formatOptionalValue = (value?: string | null) => value?.trim() || '-'

const getTeamScore = (game: Game, teamId?: string) => {
  const score = game.score as { pointsByTeam?: Record<string, number> } | null

  return teamId && score?.pointsByTeam ? (score.pointsByTeam[teamId] ?? null) : null
}

const formatScore = (value: number | null) => (value === null ? '-' : value)
const formatGameScore = (team1Score: number | null, team2Score: number | null) =>
  `${formatScore(team1Score)} - ${formatScore(team2Score)}`

const toAdminGameRow = (game: Game): AdminGameRow => {
  const teams = Array.from(game.contestants)
  const team1 = teams[0]
  const team2 = teams[1]
  const team1Score = getTeamScore(game, team1?.id)
  const team2Score = getTeamScore(game, team2?.id)

  return {
    court: game.court,
    game,
    group: game.group,
    id: game.id,
    name: formatOptionalValue(game.name),
    phase: game.phase.name,
    referee: formatOptionalValue(game.referee?.name),
    score: formatGameScore(team1Score, team2Score),
    status: game.status,
    team1: formatOptionalValue(team1?.name),
    team2: formatOptionalValue(team2?.name),
    teams: teams.map((team) => team.name).join(' / '),
    time: game.time,
  }
}

export const AdminGamesView = () => {
  const { games, isLoading, errorMessage } = useGames()
  const { phases } = usePhases()
  const { teams } = useTeams()
  const { mutate } = useSWRConfig()
  const [drawerMode, setDrawerMode] = useState<GameDrawerMode>('idle')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const rows = useMemo(() => games.map(toAdminGameRow), [games])
  const columns = useMemo<GridColDef<AdminGameRow>[]>(
    () => [
      {
        field: 'time',
        flex: 1,
        headerName: 'Heure',
        minWidth: 170,
        type: 'dateTime',
        valueFormatter: (value: Date) => dateFormatter.format(value),
      },
      {
        field: 'phase',
        flex: 1,
        headerName: 'Phase',
        minWidth: 150,
        type: 'singleSelect',
        valueOptions: [...new Set(rows.map((row) => row.phase))],
      },
      {
        field: 'group',
        flex: 0.8,
        headerName: 'Groupe',
        minWidth: 130,
        type: 'singleSelect',
        valueOptions: [...new Set(rows.map((row) => row.group))],
      },
      {
        field: 'team1',
        flex: 1,
        headerName: 'Equipe 1',
        minWidth: 170,
      },
      {
        align: 'center',
        field: 'score',
        headerAlign: 'center',
        headerName: 'Score',
        minWidth: 110,
        sortable: false,
      },
      {
        field: 'team2',
        flex: 1,
        headerName: 'Equipe 2',
        minWidth: 170,
      },
      {
        field: 'name',
        flex: 1,
        headerName: 'Nom',
        minWidth: 150,
      },
      {
        field: 'court',
        flex: 0.8,
        headerName: 'Terrain',
        minWidth: 130,
        type: 'singleSelect',
        valueOptions: [...new Set(rows.map((row) => row.court))],
      },
      {
        field: 'status',
        flex: 0.8,
        headerName: 'Statut',
        minWidth: 140,
        type: 'singleSelect',
        valueOptions: [...new Set(rows.map((row) => row.status))],
      },
      {
        field: 'teams',
        flex: 1.2,
        headerName: 'Equipes',
        minWidth: 220,
      },
      {
        field: 'referee',
        flex: 1,
        headerName: 'Arbitre',
        minWidth: 150,
      },
    ],
    [rows],
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
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <DataGrid
              autoHeight
              columns={columns}
              disableVirtualization={import.meta.env.MODE === 'test'}
              disableRowSelectionOnClick
              getRowHeight={() => 'auto'}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    court: false,
                    id: false,
                    name: false,
                    referee: false,
                    status: false,
                    teams: false,
                  },
                },
                filter: {
                  filterModel: {
                    items: [],
                    quickFilterExcludeHiddenColumns: false,
                  },
                },
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              localeText={{
                noRowsLabel: 'Aucun match disponible.',
              }}
              onRowClick={(params) => openUpdateDrawer(params.row.game)}
              pageSizeOptions={[10, 25, 50]}
              rows={rows}
              showToolbar
              slotProps={{
                toolbar: {
                  csvOptions: { disableToolbarButton: true },
                  printOptions: { disableToolbarButton: true },
                  quickFilterProps: { debounceMs: 0 },
                },
              }}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell': {
                  alignItems: 'center',
                  display: 'flex',
                  py: 1,
                },
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                },
              }}
            />
          </CardContent>
        </Card>
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
