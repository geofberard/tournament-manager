import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PublicRankingsView } from './PublicRankingsView'
import * as usePhasesHook from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ phase }: { phase: { id: string } }) => <div>PhaseRankingCard {phase.id}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesHook.usePhases)

afterEach(() => {
  cleanup()
})

describe('PublicRankingsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display root phase tabs and select the last root phase by default', () => {
    usePhasesMock.mockReturnValue({
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-2', name: 'Finales', order: 2, type: 'BRACKET' },
      ],
      isLoading: false,
      errorMessage: null,
    })

    render(<MemoryRouter><PublicRankingsView /></MemoryRouter>)

    expect(screen.getByRole('tab', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Poule A' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Finales' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Brassage' }))

    expect(screen.getByText('PhaseRankingCard phase-1-a')).toBeInTheDocument()
  })

  it('should display rankings for pool phases inside the selected root phase branch', () => {
    usePhasesMock.mockReturnValue({
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a-parent', parentId: 'phase-1', name: 'Matin', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1-a-parent', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-1-b', parentId: 'phase-1', name: 'Poule B', order: 2, type: 'POOL' },
      ],
      isLoading: false,
      errorMessage: null,
    })

    render(<MemoryRouter><PublicRankingsView /></MemoryRouter>)

    expect(screen.getByText('PhaseRankingCard phase-1-a')).toBeInTheDocument()
    expect(screen.getByText('PhaseRankingCard phase-1-b')).toBeInTheDocument()
  })

  it('should display loading and error states', () => {
    usePhasesMock.mockReturnValue({ phases: [], isLoading: true, errorMessage: null })
    const { rerender } = render(<MemoryRouter><PublicRankingsView /></MemoryRouter>)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    usePhasesMock.mockReturnValue({ phases: [], isLoading: false, errorMessage: 'Erreur phases' })
    rerender(<MemoryRouter><PublicRankingsView /></MemoryRouter>)
    expect(screen.getByText('Erreur phases')).toBeInTheDocument()
  })
})
