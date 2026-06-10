import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { useGames } from '../../hooks/useGames'
import type { Game } from '../../services/gamesService'

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
              }}
            />
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
