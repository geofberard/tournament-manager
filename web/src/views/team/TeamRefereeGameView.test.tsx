import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, beforeEach, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TeamRefereeGameView } from './TeamRefereeGameView'
import type { Game } from '../../services/apiClient'

vi.mock('../../hooks/useGames', () => ({
  useGame: vi.fn(),
}))

let useGameMock: ReturnType<typeof vi.fn>

describe('TeamRefereeGameView', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  beforeEach(async () => {
    const useGames = await import('../../hooks/useGames')
    useGameMock = vi.mocked(useGames.useGame)
    useGameMock.mockReset()
  })

  it('should render loading indicator while the game is loading', () => {
    useGameMock.mockReturnValue({ game: null, isLoading: true, errorMessage: null })

    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter initialEntries={['/team/referee/game/game-1']}>
          <Routes>
            <Route path="/team/referee/game/:id" element={<TeamRefereeGameView />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render game details and the GameCounter when the game is loaded', () => {
    const game = {
      id: 'game-1',
      phase: { id: 'phase-1', name: 'Phase Finale', order: 1, type: 'POOL' },
      group: 'Poule A',
      time: new Date('2026-05-01T18:30:00Z'),
      court: 'Terrain 1',
      status: 'scheduled',
      contestants: new Set([
        { id: 'team-1', name: 'Tigres' },
        { id: 'team-2', name: 'Lions' },
      ]),
      referee: undefined,
      score: { pointsByTeam: { 'team-1': 0, 'team-2': 0 } },
    } as Game

    useGameMock.mockReturnValue({ game, isLoading: false, errorMessage: null })

    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter initialEntries={['/team/referee/game/game-1']}>
          <Routes>
            <Route path="/team/referee/game/:id" element={<TeamRefereeGameView />} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Tigres vs Lions' })).toBeInTheDocument()
    expect(screen.getByText(/Terrain 1/)).toBeInTheDocument()
    expect(screen.getByText(/Phase: Phase Finale/)).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByText('Lions')).toBeInTheDocument()
  })
})
