import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TeamRefereeGameView } from './TeamRefereeGameView'
import type { Game } from '../../services/apiClient'

vi.mock('../../hooks/useGame', () => ({
  useGame: vi.fn(),
}))

vi.mock('../../components/shared/GameCounter', () => ({
  GameCounter: ({ game }: { game: Game }) => (
    <div data-testid="game-counter">GameCounter:{game.id}</div>
  ),
}))

import * as useGameModule from '../../hooks/useGame'
const useGameMock = vi.mocked(useGameModule.useGame)

const baseGame: Game = {
  id: 'game-1',
  phase: { id: 'phase-1', name: 'Phase Finale', order: 1, type: 'POOL' },
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

const renderWithRoute = (path: string, routePath: string) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePath} element={<TeamRefereeGameView />} />
          <Route path="/team/games" element={<div>Liste des matchs</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('TeamRefereeGameView', () => {
  afterEach(() => {
    cleanup()
    vi.resetAllMocks()
  })

  it('should redirect to /team/games when no ID is in the URL', () => {
    // Route without :id param → component receives id = undefined
    render(
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter initialEntries={['/team/referee/game']}>
          <Routes>
            <Route path="/team/referee/game" element={<TeamRefereeGameView />} />
            <Route path="/team/games" element={<div>Liste des matchs</div>} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.getByText('Liste des matchs')).toBeInTheDocument()
  })

  it('should render loading indicator while the game is loading', () => {
    useGameMock.mockReturnValue({ game: null, isLoading: true, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should redirect to /team/games when the game is not found after loading', () => {
    useGameMock.mockReturnValue({ game: null, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('Liste des matchs')).toBeInTheDocument()
  })

  it('should render the contestants in the heading separated by VS', () => {
    useGameMock.mockReturnValue({ game: baseGame, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByRole('heading', { name: 'Tigres VS Lions' })).toBeInTheDocument()
  })

  it('should render the court chip', () => {
    useGameMock.mockReturnValue({ game: baseGame, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('Terrain 1')).toBeInTheDocument()
  })

  it('should render a fallback court chip when court is missing', () => {
    const game = { ...baseGame, court: undefined } as unknown as Game
    useGameMock.mockReturnValue({ game, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('Terrain inconnu')).toBeInTheDocument()
  })

  it('should render the phase chip', () => {
    useGameMock.mockReturnValue({ game: baseGame, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('Phase Finale')).toBeInTheDocument()
  })

  it('should render a fallback phase chip when phase is missing', () => {
    const game = { ...baseGame, phase: undefined } as unknown as Game
    useGameMock.mockReturnValue({ game, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('Phase inconnue')).toBeInTheDocument()
  })

  it('should render the formatted time chip', () => {
    useGameMock.mockReturnValue({ game: baseGame, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    // Time formatted as HH:MM – locale dependent, just assert a time-like string is present
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument()
  })

  it('should render a fallback time chip when time is missing', () => {
    const game = { ...baseGame, time: undefined } as unknown as Game
    useGameMock.mockReturnValue({ game, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByText('--:--')).toBeInTheDocument()
  })

  it('should render the GameCounter when the game is loaded', () => {
    useGameMock.mockReturnValue({ game: baseGame, isLoading: false, errorMessage: null })

    renderWithRoute('/team/referee/game/game-1', '/team/referee/game/:id')

    expect(screen.getByTestId('game-counter')).toBeInTheDocument()
    expect(screen.getByText('GameCounter:game-1')).toBeInTheDocument()
  })
})
