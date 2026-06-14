import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminGamesTableToolbar } from './AdminGamesTableToolbar'

vi.mock('@mui/x-data-grid', () => ({
  ColumnsPanelTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  FilterPanelTrigger: ({
    render: renderTrigger,
  }: {
    render: (
      props: Record<string, unknown>,
      state: { filterCount: number },
    ) => React.ReactNode
  }) => <>{renderTrigger({}, { filterCount: 0 })}</>,
  GridToolbarQuickFilter: () => <input aria-label="Recherche" />,
  Toolbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ToolbarButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  useGridRootProps: () => ({
    disableColumnFilter: false,
    disableColumnSelector: false,
    localeText: {
      toolbarColumns: 'Colonnes',
      toolbarFilters: 'Filtres',
    },
    slots: {
      columnSelectorIcon: () => <span>Colonnes</span>,
      openFilterButtonIcon: () => <span>Filtres</span>,
    },
  }),
}))

describe('AdminGamesTableToolbar', () => {
  afterEach(cleanup)

  it('should hide bulk actions without selected games', () => {
    // GIVEN / WHEN
    render(
      <AdminGamesTableToolbar
        onBulkDelete={vi.fn()}
        onBulkEdit={vi.fn()}
        selectedGameCount={0}
      />,
    )

    // THEN
    expect(
      screen.queryByRole('button', { name: 'Modifier les matchs selectionnes' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Supprimer' })).not.toBeInTheDocument()
  })

  it('should display selected games and trigger bulk edition', () => {
    // GIVEN
    const onBulkEdit = vi.fn()
    render(
      <AdminGamesTableToolbar
        onBulkDelete={vi.fn()}
        onBulkEdit={onBulkEdit}
        selectedGameCount={2}
      />,
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs selectionnes' }))

    // THEN
    expect(screen.getByText('2 matchs selectionnes')).toBeInTheDocument()
    expect(onBulkEdit).toHaveBeenCalledOnce()
  })
})
