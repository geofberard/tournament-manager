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
  PhaseRankingCard: ({ phaseName }: { phaseName: string }) => <div>PhaseRankingCard {phaseName}</div>,
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

    expect(screen.getByText('PhaseRankingCard Phase 1')).toBeInTheDocument()
    expect(screen.getByTestId('pitch-status')).toBeInTheDocument()
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
