import { cleanup, render, screen } from '@testing-library/react'
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

  it('should render the two game sections', () => {
    // GIVEN
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          id: 'game-1',
          position: 1,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          status: GameStatus.Scheduled,
          time: new Date('2099-01-01T10:00:00Z'),
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        },
        {
          id: 'game-2',
          position: 2,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          group: 'Poule A',
          status: GameStatus.Completed,
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
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
  })
})
