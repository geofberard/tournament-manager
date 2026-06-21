import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamGamesView } from './TeamGamesView'
import { GameStatus, type Game } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)

describe('TeamGamesView', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render every game from the groups in which the team participates', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          id: 'game-1',
          position: 2,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          court: 'Terrain 1',
          status: GameStatus.Scheduled,
          time: new Date('2099-01-01T10:00:00Z'),
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        },
        {
          id: 'game-2',
          position: 2,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          court: 'Terrain 1',
          status: GameStatus.Completed,
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        },
        {
          id: 'game-before',
          position: 1,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          court: 'Terrain 1',
          status: GameStatus.Scheduled,
          contestants: new Set([{ id: 'team-3', name: 'Panthères' }]),
        },
        {
          id: 'game-other-group',
          position: 3,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule B',
          court: 'Terrain 2',
          status: GameStatus.Scheduled,
          contestants: new Set([{ id: 'team-4', name: 'Lynx' }]),
        },
        {
          id: 'game-refereed-by-team',
          position: 3,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          court: 'Terrain 2',
          status: GameStatus.Scheduled,
          contestants: new Set([{ id: 'team-6', name: 'Lions' }]),
          referee: { id: 'team-2', name: 'Tigres' },
        },
        {
          id: 'game-same-name-other-phase',
          position: 4,
          phase: { id: 'phase-2', name: 'Finale', order: 2, type: 'POOL' },
          group: 'Poule A',
          court: 'Terrain 2',
          status: GameStatus.Scheduled,
          contestants: new Set([{ id: 'team-5', name: 'Ours' }]),
        },
      ] as Game[],
      isLoading: false,
    })

    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TeamGamesView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByRole('heading', { name: 'Prochains matchs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Matchs terminés' })).toBeInTheDocument()
    expect(screen.getByText('Panthères')).toBeInTheDocument()
    expect(screen.queryByText('Lynx')).not.toBeInTheDocument()
    expect(screen.queryByText('Ours')).not.toBeInTheDocument()
    expect(screen.getByText('Attente : 1 match')).toBeInTheDocument()
  })

  it('should filter the list to games played or refereed by the team', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          id: 'team-game',
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          status: GameStatus.Scheduled,
          contestants: new Set([
            { id: 'team-2', name: 'Tigres' },
            { id: 'team-3', name: 'Panthères' },
          ]),
        },
        {
          id: 'group-game',
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          status: GameStatus.Scheduled,
          contestants: new Set([
            { id: 'team-4', name: 'Lynx' },
            { id: 'team-5', name: 'Ours' },
          ]),
        },
        {
          id: 'referee-game',
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          status: GameStatus.Scheduled,
          contestants: new Set([
            { id: 'team-6', name: 'Lions' },
            { id: 'team-7', name: 'Aigles' },
          ]),
          referee: { id: 'team-2', name: 'Tigres' },
        },
      ] as Game[],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <TeamGamesView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByText('Lynx')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Mes matchs'))

    expect(screen.queryByText('Lynx')).not.toBeInTheDocument()
    expect(screen.getByText('Panthères')).toBeInTheDocument()
    expect(screen.getByText('Lions')).toBeInTheDocument()
    expect(screen.getByLabelText('Mes matchs')).toBeChecked()
  })
})
