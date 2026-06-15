import { Card, CardContent } from '@mui/material'
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid'
import { useMemo } from 'react'
import type { Game } from '../../services/gamesService'
import { AdminGamesTableToolbar } from './AdminGamesTableToolbar'
import { EditableGameScore } from './EditableGameScore'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

type AdminGameRow = {
  court: string
  game: Game
  group: string
  id: string
  subgroup: string
  phase: string
  referee: string
  score: string
  status: string
  team1: string
  team2: string
  teams: string
  time: Date
}

type AdminGamesTableProps = {
  games: Game[]
  onBulkEdit: () => void
  onBulkDelete: () => Promise<void>
  onGameClick: (game: Game) => void
  onScoreSave: (game: Game, pointsByTeam: Record<string, number>) => Promise<void>
  onSelectionChange: (gameIds: Set<string>) => void
  selectedGameIds: Set<string>
}

const formatOptionalValue = (value?: string | null) => value?.trim() || '-'

const getTeamScore = (game: Game, teamId?: string) =>
  teamId && game.score?.pointsByTeam ? (game.score.pointsByTeam[teamId] ?? null) : null

const formatScore = (value: number | null) => (value === null ? '-' : value)

const formatGameScore = (team1Score: number | null, team2Score: number | null) =>
  `${formatScore(team1Score)} - ${formatScore(team2Score)}`

const toAdminGameRow = (game: Game): AdminGameRow => {
  const teams = Array.from(game.contestants)
  const team1 = teams[0]
  const team2 = teams[1]
  const team1Score = getTeamScore(game, team1?.id)
  const team2Score = getTeamScore(game, team2?.id)
  const hasScore = team1Score !== null || team2Score !== null

  return {
    court: game.court,
    game,
    group: game.group,
    id: game.id,
    subgroup: formatOptionalValue(game.subgroup),
    phase: game.phase.name,
    referee: formatOptionalValue(game.referee?.name),
    score: hasScore ? formatGameScore(team1Score, team2Score) : '∅',
    status: game.status,
    team1: formatOptionalValue(team1?.name),
    team2: formatOptionalValue(team2?.name),
    teams: teams.map((team) => team.name).join(' / '),
    time: game.time,
  }
}

export const AdminGamesTable = ({
  games,
  onBulkDelete,
  onBulkEdit,
  onGameClick,
  onScoreSave,
  onSelectionChange,
  selectedGameIds,
}: AdminGamesTableProps) => {
  const rows = useMemo(() => games.map(toAdminGameRow), [games])
  const rowSelectionModel = useMemo<GridRowSelectionModel>(
    () => ({ ids: selectedGameIds, type: 'include' }),
    [selectedGameIds],
  )
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
        minWidth: 120,
        renderCell: (params) => (
          <EditableGameScore
            game={params.row.game}
            onSave={(score) => onScoreSave(params.row.game, score)}
          />
        ),
        sortable: false,
      },
      {
        field: 'team2',
        flex: 1,
        headerName: 'Equipe 2',
        minWidth: 170,
      },
      {
        field: 'subgroup',
        flex: 1,
        headerName: 'Sous-groupe',
        minWidth: 150,
        type: 'singleSelect',
        valueOptions: [...new Set(rows.map((row) => row.subgroup))],
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
    [onScoreSave, rows],
  )

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <DataGrid
          autoHeight
          checkboxSelection
          columns={columns}
          disableRowSelectionExcludeModel
          disableVirtualization={import.meta.env.MODE === 'test'}
          disableRowSelectionOnClick
          getRowHeight={() => 'auto'}
          initialState={{
            columns: {
              columnVisibilityModel: {
                court: false,
                id: false,
                subgroup: false,
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
            checkboxSelectionHeaderName: 'Selectionner les matchs',
            checkboxSelectionSelectAllRows: 'Selectionner tous les matchs',
            checkboxSelectionSelectRow: 'Selectionner le match',
            checkboxSelectionUnselectAllRows: 'Deselectionner tous les matchs',
            checkboxSelectionUnselectRow: 'Deselectionner le match',
            noRowsLabel: 'Aucun match disponible.',
          }}
          onRowClick={(params) => onGameClick(params.row.game)}
          onRowSelectionModelChange={(selectionModel) =>
            onSelectionChange(new Set(Array.from(selectionModel.ids, String)))
          }
          pageSizeOptions={[10, 25, 50]}
          rowSelectionModel={rowSelectionModel}
          rows={rows}
          showToolbar
          slots={{ toolbar: AdminGamesTableToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              onBulkDelete,
              onBulkEdit,
              printOptions: { disableToolbarButton: true },
              quickFilterProps: { debounceMs: 0 },
              selectedGameCount: selectedGameIds.size,
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
  )
}
