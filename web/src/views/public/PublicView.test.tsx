import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { PublicView } from './PublicView'
import * as usePhasesHook from '../../hooks/usePhases'
import * as useGroupRankingsHook from '../../hooks/useGroupRankings'
import * as useGamesHook from '../../hooks/useGames'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../hooks/useGroupRankings', () => ({
  usePhaseGroups: vi.fn(),
  useGroupRankings: vi.fn(),
}))

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../components/shared/GroupRankingCard', () => ({
  GroupRankingCard: ({ groupId }: { groupId: string }) => <div data-testid="group-ranking-card">GroupRankingCard {groupId}</div>,
}))

vi.mock('../../components/shared/PitchStatus', () => ({
  PitchStatus: () => <div data-testid="pitch-status">PitchStatus</div>,
}))

const usePhasesMock = vi.mocked(usePhasesHook.usePhases)
const usePhaseGroupsMock = vi.mocked(useGroupRankingsHook.usePhaseGroups)
const useGamesMock = vi.mocked(useGamesHook.useGames)

describe('PublicView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display an info message if no phase is available', () => {
    usePhasesMock.mockReturnValue({ phases: [], isLoading: false, errorMessage: null })
    usePhaseGroupsMock.mockReturnValue({ groups: [], isLoading: false, errorMessage: null })
    useGamesMock.mockReturnValue({ games: [], isLoading: false, errorMessage: null })

    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>
    )

    expect(screen.getByText("Aucun tournoi n'est configuré pour le moment.")).toBeInTheDocument()
  })

  it('should display groups and pitches when data is available', () => {
    usePhasesMock.mockReturnValue({
      phases: [{ id: 'phase-1', type: 'POOL', name: 'Phase 1' }],
      isLoading: false,
      errorMessage: null,
    })

    usePhaseGroupsMock.mockReturnValue({
      groups: [{ id: 'Poule A' }, { id: 'Poule B' }],
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

    expect(screen.getByText('GroupRankingCard Poule A')).toBeInTheDocument()
    expect(screen.getByText('GroupRankingCard Poule B')).toBeInTheDocument()
    expect(screen.getByTestId('pitch-status')).toBeInTheDocument()
  })

  it('should display errors from hooks', () => {
    usePhasesMock.mockReturnValue({
      phases: [{ id: 'phase-1', type: 'POOL', name: 'Phase 1' }],
      isLoading: false,
      errorMessage: null,
    })

    usePhaseGroupsMock.mockReturnValue({
      groups: [],
      isLoading: false,
      errorMessage: 'Erreur groupes',
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

    expect(screen.getByText('Erreur groupes')).toBeInTheDocument()
    expect(screen.getByText('Erreur matchs')).toBeInTheDocument()
  })
})
