import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRankingsView } from './AdminRankingsView'
import * as usePhasesModule from '../../hooks/usePhases'
import * as statisticsService from '../../services/statisticsService'

vi.mock('../../hooks/usePhases', () => ({ usePhases: vi.fn() }))
vi.mock('../../services/statisticsService', () => ({ listPhaseRankings: vi.fn() }))
vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ extended, phaseId, phaseName }: { extended: boolean, phaseId: string, phaseName: string }) =>
    <div>{phaseName} ({phaseId}) - {extended ? 'étendu' : 'simple'}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const listPhaseRankingsMock = vi.mocked(statisticsService.listPhaseRankings)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminRankingsView />
  </ThemeProvider>,
)

describe('AdminRankingsView', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('should display root phase tabs and extended rankings for pool descendants', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-1-b-parent', parentId: 'phase-1', name: 'Niveau intermediaire', order: 2 },
        { id: 'phase-1-b', parentId: 'phase-1-b-parent', name: 'Poule B', order: 1, type: 'POOL' },
        { id: 'phase-2', name: 'Finales', order: 2, type: 'BRACKET' },
      ],
    })
    renderView()

    expect(screen.getByRole('heading', { name: 'Classements' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Poule A' })).not.toBeInTheDocument()
    expect(screen.getByText('Poule A (phase-1-a) - étendu')).toBeInTheDocument()
    expect(screen.getByText('Poule B (phase-1-b) - étendu')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Classement global' })).not.toBeChecked()

    fireEvent.click(screen.getByRole('tab', { name: 'Finales' }))
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()
  })

  it('should display one global ranking table when requested', async () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-1-b', parentId: 'phase-1', name: 'Poule B', order: 2, type: 'POOL' },
      ],
    })
    listPhaseRankingsMock.mockImplementation(async (phaseId) => {
      if (phaseId === 'phase-1-a') {
        return [{
          contestant: { id: 'team-1', name: 'Aigles' },
          drawn: 0,
          lost: 0,
          played: 2,
          pointsAgainst: 10,
          pointsDiff: 20,
          pointsFor: 30,
          score: 6,
          won: 2,
        }]
      }

      return [{
        contestant: { id: 'team-2', name: 'Tigres' },
        drawn: 0,
        lost: 1,
        played: 2,
        pointsAgainst: 24,
        pointsDiff: -4,
        pointsFor: 20,
        score: 3,
        won: 1,
      }]
    })

    renderView()

    fireEvent.click(screen.getByRole('switch', { name: 'Classement global' }))

    expect(screen.queryByText('Poule A (phase-1-a) - étendu')).not.toBeInTheDocument()
    expect(screen.queryByText('Poule B (phase-1-b) - étendu')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Classement global' })).toBeInTheDocument()
    await waitFor(() => expect(listPhaseRankingsMock).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.getByText('Aigles')).toBeInTheDocument())
    expect(screen.getByText('Tigres')).toBeInTheDocument()
  })

  it('should display an empty state when no phase exists', () => {
    usePhasesMock.mockReturnValue({ errorMessage: null, isLoading: false, phases: [] })
    renderView()

    expect(screen.getByText("Aucune phase n'est disponible pour le moment.")).toBeInTheDocument()
  })
})
