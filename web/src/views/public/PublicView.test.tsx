import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { PublicView } from './PublicView'
import * as usePhasesHook from '../../hooks/usePhases'
import * as useGamesHook from '../../hooks/useGames'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ phase }: { phase: { id: string } }) => <div>PhaseRankingCard {phase.id}</div>,
}))

vi.mock('../../components/shared/PitchStatus', () => ({
  PitchStatus: () => <div data-testid="pitch-status">PitchStatus</div>,
}))

const usePhasesMock = vi.mocked(usePhasesHook.usePhases)
const useGamesMock = vi.mocked(useGamesHook.useGames)

describe('PublicView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display an info message if no phase is available', () => {
    usePhasesMock.mockReturnValue({ phases: [], isLoading: false, errorMessage: null })
    useGamesMock.mockReturnValue({ games: [], isLoading: false, errorMessage: null })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByText("Aucun tournoi n'est configuré pour le moment.")).toBeInTheDocument()
  })

  it('should display phase rankings and pitches when data is available', () => {
    usePhasesMock.mockReturnValue({
      phases: [{ id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 }],
      isLoading: false,
      errorMessage: null,
    })

    useGamesMock.mockReturnValue({
      games: [],
      isLoading: false,
      errorMessage: null,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByText('PhaseRankingCard phase-1')).toBeInTheDocument()
    expect(screen.getByTestId('pitch-status')).toBeInTheDocument()
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

    useGamesMock.mockReturnValue({
      games: [],
      isLoading: false,
      errorMessage: null,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByRole('tab', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Poule A' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Finales' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()
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

    useGamesMock.mockReturnValue({
      games: [],
      isLoading: false,
      errorMessage: null,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByText('PhaseRankingCard phase-1-a')).toBeInTheDocument()
    expect(screen.getByText('PhaseRankingCard phase-1-b')).toBeInTheDocument()
  })

  it('should display errors from hooks', () => {
    usePhasesMock.mockReturnValue({
      phases: [{ id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 }],
      isLoading: false,
      errorMessage: null,
    })

    useGamesMock.mockReturnValue({
      games: [],
      isLoading: false,
      errorMessage: 'Erreur matchs',
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByText('Erreur matchs')).toBeInTheDocument()
  })
})
