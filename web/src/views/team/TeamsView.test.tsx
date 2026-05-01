import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamGamesView, TeamRankingsView, TeamsView } from './TeamsView'
import { GameStatus } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'
import * as useRankingsModule from '../../hooks/useRankings'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../hooks/useRankings', () => ({
  useRankings: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)
const useRankingsMock = vi.mocked(useRankingsModule.useRankings)

describe('TeamsView', () => {
  afterEach(() => {
    cleanup()
  })

  it('should keep the legacy team home export on the rankings page', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    useRankingsMock.mockReturnValue({
      poolName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Resultat' })).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Vos matchs' })).not.toBeInTheDocument()
  })

  it('should render the rankings page only', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    useRankingsMock.mockReturnValue({
      poolName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamRankingsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Resultat' })).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Vos matchs' })).not.toBeInTheDocument()
  })

  it('should render the matches page only', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    useRankingsMock.mockReturnValue({
      poolName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamGamesView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Prochains matchs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Matchs terminés' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Resultat' })).not.toBeInTheDocument()
  })

  it('should split team games into upcoming and completed lists in chronological order', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      games: [
        {
          id: 'game-1',
          pool: 'Poule A',
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
          pool: 'Poule A',
          time: new Date('2026-05-02T18:00:00Z'),
          court: 'Annexe',
          status: GameStatus.Completed,
          contestants: new Set([
            { id: 'team-1', name: 'Aigles' },
            { id: 'team-2', name: 'Tigres' },
          ]),
          referee: undefined,
          score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
        },
        {
          id: 'game-3',
          pool: 'Poule B',
          time: new Date('2026-05-03T18:00:00Z'),
          court: 'Court 2',
          status: GameStatus.InProgress,
          contestants: new Set([
            { id: 'team-2', name: 'Tigres' },
            { id: 'team-5', name: 'Bisons' },
          ]),
          referee: undefined,
          score: { pointsByTeam: { 'team-2': 12, 'team-5': 10 } },
        },
        {
          id: 'game-4',
          pool: 'Poule B',
          time: new Date('2026-05-01T18:00:00Z'),
          court: 'Court 3',
          status: GameStatus.Completed,
          contestants: new Set([
            { id: 'team-2', name: 'Tigres' },
            { id: 'team-6', name: 'Pumas' },
          ]),
          referee: undefined,
          score: { pointsByTeam: { 'team-2': 21, 'team-6': 19 } },
        },
      ],
    })
    useRankingsMock.mockReturnValue({
      poolName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamGamesView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    const upcomingHeading = screen.getByRole('heading', { name: 'Prochains matchs' })
    const completedHeading = screen.getByRole('heading', { name: 'Matchs terminés' })
    const cards = screen.getAllByText(/Tigres vs|Aigles vs/)

    expect(upcomingHeading).toBeInTheDocument()
    expect(completedHeading).toBeInTheDocument()
    expect(cards.map((card) => card.textContent)).toEqual([
      'Tigres vs Bisons',
      'Tigres vs Lynx',
      'Tigres vs Pumas',
      'Aigles vs Tigres',
    ])
  })
})
