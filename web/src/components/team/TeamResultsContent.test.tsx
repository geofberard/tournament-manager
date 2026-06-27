import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamResultsContent } from './TeamResultsContent'
import { GameStatus, type Game } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'
import * as usePhaseRankingsModule from '../../hooks/usePhaseRankings'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../hooks/usePhaseRankings', () => ({
  usePhaseRankings: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)
const usePhaseRankingsMock = vi.mocked(usePhaseRankingsModule.usePhaseRankings)
const teamPoolGame: Game = {
  id: 'game-1',
  phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
  phasePath: [{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }],
  position: 1000,
  time: new Date('2026-05-03T18:00:00Z'),
  court: 'Annexe',
  status: GameStatus.Completed,
  contestants: new Set([
    { id: 'team-1', name: 'Aigles' },
    { id: 'team-2', name: 'Tigres' },
  ]),
  referee: undefined,
  score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
}

describe('TeamResultsContent', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render pool rankings for the selected phase', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [teamPoolGame],
      isLoading: false,
    })
    usePhaseRankingsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamResultsContent
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          poolPhases={[{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }]}
          selectedPhase={{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }}
          showAllResults={false}
        />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText("Les resultats ne sont pas encore disponibles.")).toBeInTheDocument()
  })

  it('should hide pool rankings where the selected team does not participate by default', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [teamPoolGame],
      isLoading: false,
    })
    usePhaseRankingsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamResultsContent
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          poolPhases={[
            { id: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
            { id: 'phase-2', name: 'Poule B', order: 2, type: 'POOL' },
          ]}
          selectedPhase={{ id: 'root-phase', name: 'Brassage', order: 1 }}
          showAllResults={false}
        />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.queryByText('Poule B')).not.toBeInTheDocument()
  })

  it('should render every pool ranking when all results are requested', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [teamPoolGame],
      isLoading: false,
    })
    usePhaseRankingsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamResultsContent
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          poolPhases={[
            { id: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
            { id: 'phase-2', name: 'Poule B', order: 2, type: 'POOL' },
          ]}
          selectedPhase={{ id: 'root-phase', name: 'Brassage', order: 1 }}
          showAllResults
        />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Poule B')).toBeInTheDocument()
  })
})
