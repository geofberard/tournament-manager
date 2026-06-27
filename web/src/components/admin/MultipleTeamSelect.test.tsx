import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildPhaseTree, usePhaseTree } from '../../hooks/usePhaseTree'
import * as statisticsService from '../../services/statisticsService'
import { MultipleTeamSelect } from './MultipleTeamSelect'

vi.mock('../../hooks/usePhaseTree', async () => {
  const actual = await vi.importActual<typeof import('../../hooks/usePhaseTree')>('../../hooks/usePhaseTree')
  return { ...actual, usePhaseTree: vi.fn() }
})
vi.mock('../../services/statisticsService', () => ({ getPhaseStatistics: vi.fn() }))

const phases = [
  { id: 'phase-root', name: 'Tournoi', order: 1 },
  { id: 'phase-pool', name: 'Brassage', order: 1, parentId: 'phase-root', type: 'POOL' as const },
  { id: 'phase-bracket', name: 'Finales', order: 2, parentId: 'phase-root', type: 'BRACKET' as const },
]
const phaseTree = buildPhaseTree(phases)
const teams = [
  { id: 'team-1', name: 'Tigres' },
  { id: 'team-2', name: 'Lynx' },
  { id: 'team-3', name: 'Aigles' },
]

const renderSelect = ({
  onLoadingChange = vi.fn(),
  onSelectedTeamIdsChange = vi.fn(),
  selectedTeamIds = new Set<string>(),
} = {}) => {
  vi.mocked(usePhaseTree).mockReturnValue({
    errorMessage: null,
    isLoading: false,
    phases,
    phaseTree,
  })
  render(
    <ThemeProvider theme={createTheme()}>
      <MultipleTeamSelect
        onLoadingChange={onLoadingChange}
        onSelectedTeamIdsChange={onSelectedTeamIdsChange}
        selectedTeamIds={selectedTeamIds}
        teams={teams}
      />
    </ThemeProvider>,
  )

  return { onLoadingChange, onSelectedTeamIdsChange }
}

describe('MultipleTeamSelect', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should select and unselect teams', () => {
    // GIVEN
    const { onSelectedTeamIdsChange } = renderSelect()

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tigres' }))

    // THEN
    expect(onSelectedTeamIdsChange).toHaveBeenCalledWith(new Set(['team-1']))
  })

  it('should grey out teams already present in the selected reference phase', async () => {
    // GIVEN
    vi.mocked(statisticsService.getPhaseStatistics).mockResolvedValue({
      completionRate: 0,
      gameCount: 1,
      teamStats: [],
      teams: [{ id: 'team-1', name: 'Tigres' }],
    })
    const { onLoadingChange, onSelectedTeamIdsChange } = renderSelect({
      selectedTeamIds: new Set(['team-1', 'team-2']),
    })

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Filtrer par phase' }))
    fireEvent.click(screen.getByRole('option', { name: 'Brassage' }))

    // THEN
    await waitFor(() => expect(screen.getByRole('checkbox', { name: /Tigres/ })).toBeDisabled())
    expect(onSelectedTeamIdsChange).toHaveBeenCalledWith(new Set(['team-2']))
    expect(screen.getByText(/2 equipes disponibles\./)).toBeInTheDocument()
    expect(screen.getByText('Deja dans Brassage')).toBeInTheDocument()
    expect(onLoadingChange).toHaveBeenNthCalledWith(1, true)
    expect(onLoadingChange).toHaveBeenLastCalledWith(false)
  })
})
