import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRankingsView } from './AdminRankingsView'
import * as usePhasesModule from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({ usePhases: vi.fn() }))
vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ extended, phase }: { extended?: boolean, phase: { id: string } }) =>
    <div>PhaseRankingCard {phase.id} {extended ? 'étendu' : 'simple'}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminRankingsView />
  </ThemeProvider>,
)

describe('AdminRankingsView', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => cleanup())

  it('should select the last root phase by default and display rankings after switching tabs', () => {
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
    expect(screen.getByRole('tab', { name: 'Finales' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Brassage' }))

    expect(screen.getByText('PhaseRankingCard phase-1-a étendu')).toBeInTheDocument()
    expect(screen.getByText('PhaseRankingCard phase-1-b étendu')).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Classement global' })).not.toBeChecked()

    fireEvent.click(screen.getByRole('tab', { name: 'Finales' }))
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()
  })

  it('should display the selected root phase ranking when global ranking is requested', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-1-b', parentId: 'phase-1', name: 'Poule B', order: 2, type: 'POOL' },
      ],
    })

    renderView()

    fireEvent.click(screen.getByRole('switch', { name: 'Classement global' }))

    expect(screen.queryByText('PhaseRankingCard phase-1-a étendu')).not.toBeInTheDocument()
    expect(screen.queryByText('PhaseRankingCard phase-1-b étendu')).not.toBeInTheDocument()
    expect(screen.getByText('PhaseRankingCard phase-1 étendu')).toBeInTheDocument()
  })

  it('should display an empty state when no phase exists', () => {
    usePhasesMock.mockReturnValue({ errorMessage: null, isLoading: false, phases: [] })
    renderView()

    expect(screen.getByText("Aucune phase n'est disponible pour le moment.")).toBeInTheDocument()
  })
})
