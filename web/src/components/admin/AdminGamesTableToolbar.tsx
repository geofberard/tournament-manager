import EditIcon from '@mui/icons-material/Edit'
import { Badge, Tooltip, Typography } from '@mui/material'
import {
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  GridToolbarQuickFilter,
  Toolbar,
  ToolbarButton,
  type GridToolbarProps,
  useGridRootProps,
} from '@mui/x-data-grid'
import { DeleteButton } from './DeleteButton'

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onBulkDelete: () => Promise<void>
    onBulkEdit: () => void
    selectedGameCount: number
  }
}

type AdminGamesTableToolbarProps = GridToolbarProps & {
  onBulkDelete: () => Promise<void>
  onBulkEdit: () => void
  selectedGameCount: number
}

export const AdminGamesTableToolbar = ({
  onBulkDelete,
  onBulkEdit,
  selectedGameCount,
  ...toolbarProps
}: AdminGamesTableToolbarProps) => {
  const hasSelection = selectedGameCount > 0
  const rootProps = useGridRootProps()

  return (
    <Toolbar>
      {!rootProps.disableColumnSelector ? (
        <Tooltip title={rootProps.localeText.toolbarColumns}>
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <rootProps.slots.columnSelectorIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>
      ) : null}
      {!rootProps.disableColumnFilter ? (
        <Tooltip title={rootProps.localeText.toolbarFilters}>
          <FilterPanelTrigger
            render={(triggerProps, state) => (
              <ToolbarButton
                {...triggerProps}
                color={state.filterCount > 0 ? 'primary' : 'default'}
              >
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <rootProps.slots.openFilterButtonIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
      ) : null}
      <GridToolbarQuickFilter {...toolbarProps.quickFilterProps} />
      {hasSelection ? (
        <>
          <Typography
            color="text.secondary"
            noWrap
            sx={{ display: { xs: 'none', sm: 'block' } }}
            variant="body2"
          >
            {selectedGameCount} match{selectedGameCount > 1 ? 's' : ''} selectionne
            {selectedGameCount > 1 ? 's' : ''}
          </Typography>
          <Typography
            aria-label={`${selectedGameCount} match${selectedGameCount > 1 ? 's' : ''} selectionne${selectedGameCount > 1 ? 's' : ''}`}
            color="text.secondary"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            variant="body2"
          >
            {selectedGameCount}
          </Typography>
          <Tooltip title="Modifier les matchs selectionnes">
            <ToolbarButton
              aria-label="Modifier les matchs selectionnes"
              onClick={onBulkEdit}
              size="small"
            >
              <EditIcon fontSize="small" />
            </ToolbarButton>
          </Tooltip>
          <DeleteButton onConfirm={onBulkDelete} />
        </>
      ) : null}
    </Toolbar>
  )
}
