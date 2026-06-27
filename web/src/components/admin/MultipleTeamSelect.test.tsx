import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as statisticsService from '../../services/statisticsService'
import { MultipleTeamSelect } from './MultipleTeamSelect'

vi.mock('../../services/statisticsService', () => ({ getPhaseStatistics: vi.fn() }))

const phases = [
  { id: 'phase-pool', name: 'Brassage', order: 1, type: 'POOL' as const },
  { id: 'phase-bracket', name: 'Finales', order: 2, type: 'BRACKET' as const },
]
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
  render(
    <ThemeProvider theme={createTheme()}>
      <MultipleTeamSelect
        onLoadingChange={onLoadingChange}
        onSelectedTeamIdsChange={onSelectedTeamIdsChange}
        phases={phases}
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
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase de filtre' }))
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
