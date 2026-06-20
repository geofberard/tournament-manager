import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamResultsView } from './TeamResultsView'
import { GameStatus } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'
import * as usePhasesModule from '../../hooks/usePhases'
import * as useTeamRankingsModule from '../../hooks/useTeamRankings'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../hooks/useTeamRankings', () => ({
  useTeamRankings: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)
const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const useTeamRankingsMock = vi.mocked(useTeamRankingsModule.useTeamRankings)

describe('TeamResultsView', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the team results page with tabs, details and rankings', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{
        id: 'phase-1',
        name: 'Brassage',
        details: 'Premier paragraphe.\n\nSecond paragraphe.',
        order: 1,
        type: 'POOL',
      }],
    })
    useTeamRankingsMock.mockReturnValue({
      groupName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TeamResultsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Resultats' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Phases du tournoi' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.getByText('Premier paragraphe.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraphe.')).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
  })

  it('should render a fallback message when the phase has no details', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }],
    })
    useTeamRankingsMock.mockReturnValue({
      groupName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TeamResultsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText("Aucun detail n'est disponible pour cette phase.")).toBeInTheDocument()
  })

  it('should render bracket games inside the results page for bracket phases', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      games: [
        {
          id: 'game-1',
          phase: { id: 'phase-2', name: 'Bracket final', order: 2, type: 'BRACKET' },
          group: 'Bracket principal',
          position: 2000,
          time: new Date('2026-05-04T18:00:00Z'),
          court: 'Central',
          status: GameStatus.Scheduled,
          contestants: new Set([
            { id: 'team-2', name: 'Tigres' },
            { id: 'team-4', name: 'Lynx' },
          ]),
          referee: undefined,
          score: { pointsByTeam: {} },
        },
        {
          id: 'game-2',
          phase: { id: 'phase-2', name: 'Bracket final', order: 2, type: 'BRACKET' },
          group: 'Bracket principal',
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
        },
      ],
    })
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{ id: 'phase-2', name: 'Bracket final', order: 2, type: 'BRACKET' }],
    })
    useTeamRankingsMock.mockReturnValue({
      groupName: null,
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TeamResultsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // THEN
    expect(screen.queryByText("Les resultats ne sont pas encore disponibles.")).not.toBeInTheDocument()
    expect(screen.getAllByText(/Tigres vs|Aigles vs/).map((card) => card.textContent)).toEqual([
      'Aigles vs Tigres',
      'Tigres vs Lynx',
    ])
  })
})
