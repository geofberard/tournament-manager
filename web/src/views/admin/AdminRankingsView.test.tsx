import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRankingsView } from './AdminRankingsView'
import * as usePhasesModule from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({ usePhases: vi.fn() }))
vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ extended, phaseId, phaseName }: { extended: boolean, phaseId: string, phaseName: string }) =>
    <div>{phaseName} ({phaseId}) - {extended ? 'étendu' : 'simple'}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminRankingsView />
  </ThemeProvider>,
)

describe('AdminRankingsView', () => {
  beforeEach(() => vi.clearAllMocks())

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

    fireEvent.click(screen.getByRole('tab', { name: 'Finales' }))
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()
  })

  it('should display an empty state when no phase exists', () => {
    usePhasesMock.mockReturnValue({ errorMessage: null, isLoading: false, phases: [] })
    renderView()

    expect(screen.getByText("Aucune phase n'est disponible pour le moment.")).toBeInTheDocument()
  })
})
