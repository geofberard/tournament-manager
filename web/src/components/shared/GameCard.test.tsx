import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GameCard } from './GameCard'
import { GameStatus } from '../../generated/api-client'
import { TEAM_REFEREE_GAME_PATH } from '../../app/routes'
import type { Game } from '../../services/gamesService'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

const renderCard = (game: Game) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <GameCard game={game} />
    </ThemeProvider>,
  )

const baseGame: Game = {
  id: 'game-1',
  phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
  subgroup: undefined,
  group: 'Poule A',
  time: new Date('2026-05-01T18:30:00Z'),
  court: 'Central',
  status: GameStatus.Completed,
  contestants: new Set([
    { id: 'team-1', name: 'Aigles' },
    { id: 'team-2', name: 'Tigres' },
  ]),
  referee: { id: 'team-3', name: 'Pantheres' },
  score: {
    pointsByTeam: {
      'team-1': 21,
      'team-2': 18,
    },
  },
}

describe('GameCard', () => {
  afterEach(() => {
    cleanup()
    navigateMock.mockClear()
  })

  it('should render contestants, status, score and referee', () => {
    // WHEN
    renderCard(baseGame)

    // THEN
    expect(screen.getByText('Aigles vs Tigres')).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Termine')).toBeInTheDocument()
    expect(screen.getByText('Score:')).toBeInTheDocument()
    expect(screen.getByText('21 - 18')).toBeInTheDocument()
    expect(screen.getByText('Arbitre: Pantheres')).toBeInTheDocument()
    expect(screen.getByText(/Terrain Central/)).toBeInTheDocument()
  })

  it('should render the match subgroup when provided', () => {
    // WHEN
    renderCard({
      ...baseGame,
      subgroup: '1/2',
    })

    // THEN
    expect(screen.getByText('1/2')).toBeInTheDocument()
    expect(screen.getByText('Aigles vs Tigres')).toBeInTheDocument()
  })

  it('should omit the referee block when no referee is provided', () => {
    // WHEN
    const { container } = renderCard({
      ...baseGame,
      referee: undefined,
    })

    // THEN
    expect(container).not.toHaveTextContent('Arbitre:')
  })

  it('should render missing scores as dashes', () => {
    // WHEN
    renderCard({
      ...baseGame,
      score: {
        pointsByTeam: {
          'team-1': 21,
        },
      },
    })

    // THEN
    expect(screen.getByText('21 - -')).toBeInTheDocument()
  })

  it('should render "Arbitrer le match" for scheduled games and navigate on click', () => {
    renderCard({
      ...baseGame,
      id: 'game-2',
      status: GameStatus.Scheduled,
    })

    const button = screen.getByRole('button', { name: 'Arbitrer le match' })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)

    expect(navigateMock).toHaveBeenCalledWith(
      TEAM_REFEREE_GAME_PATH.replace(':id', 'game-2'),
    )
  })

  it('should render "Continuer l\'arbitrage" for games in progress', () => {
    renderCard({
      ...baseGame,
      status: GameStatus.InProgress,
    })

    expect(
      screen.getByRole('button', { name: "Continuer l'arbitrage" }),
    ).toBeInTheDocument()
  })

  it('should not render an arbitration button when the game is completed', () => {
    renderCard({
      ...baseGame,
      status: GameStatus.Completed,
    })

    expect(
      screen.queryByRole('button', { name: /Arbitrer le match|Continuer l'arbitrage/ }),
    ).not.toBeInTheDocument()
  })
})
