import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { GameStatus } from '../../generated/api-client'
import * as useGamesModule from '../../hooks/useGames'
import { AdminGamesView } from './AdminGamesView'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)

describe('AdminGamesView', () => {
  it('should render the games table', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          contestants: new Set([
            { id: 'team-1', name: 'Tigres' },
            { id: 'team-2', name: 'Lynx' },
          ]),
          court: 'Terrain 1',
          group: 'Poule A',
          id: 'game-1',
          name: 'Finale',
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          referee: { id: 'team-3', name: 'Aigles' },
          score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
          status: GameStatus.Completed,
          time: new Date('2026-05-03T10:30:00.000Z'),
        },
      ],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(screen.getByText('Finale')).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Tigres / Lynx')).toBeInTheDocument()
    expect(screen.getByText('Tigres: 21 / Lynx: 18')).toBeInTheDocument()
    expect(screen.getByText('game-1')).toBeInTheDocument()
  })

  it('should render an empty state when there are no games', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    expect(screen.getByText('Aucun match disponible.')).toBeInTheDocument()
  })

  it('should render the loading state', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: true,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render the error message', () => {
    useGamesMock.mockReturnValue({
      errorMessage: 'Matchs indisponibles',
      games: [],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminGamesView />
      </ThemeProvider>,
    )

    expect(screen.getByText('Matchs indisponibles')).toBeInTheDocument()
  })
})
