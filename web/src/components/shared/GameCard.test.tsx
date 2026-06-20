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
      <GameCard game={game} currentTeam={{ id: 'team-1', name: 'Aigles' }} />
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
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Terminé')).toBeInTheDocument()
    expect(screen.getByText('21 - 18')).toBeInTheDocument()
    // Court and referee are not rendered for completed games
    expect(screen.queryByText('Central')).not.toBeInTheDocument()
    expect(screen.queryByText(/Arbitre/)).not.toBeInTheDocument()
  })

  it('should render the match subgroup when provided', () => {
    // WHEN
    renderCard({
      ...baseGame,
      subgroup: '1/2',
    })

    // THEN
    expect(screen.getByText('1/2')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
  })

  it('should render the court without a fallback time when no time is planned', () => {
    // WHEN
    renderCard({
      ...baseGame,
      time: undefined,
      status: GameStatus.Scheduled,
    })

    // THEN
    expect(screen.queryByText(/Horaire a definir/)).not.toBeInTheDocument()
    expect(screen.getByText('Central')).toBeInTheDocument()
  })

  it('should omit the referee block when no referee is provided', () => {
    // WHEN
    const { container } = renderCard({
      ...baseGame,
      referee: undefined,
    })

    // THEN
    expect(container).not.toHaveTextContent('Arbitre :')
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

  it('should render the arbitration action next to the alert and navigate on click', () => {
    renderCard({
      ...baseGame,
      id: 'game-2',
      status: GameStatus.InProgress,
      referee: { id: 'team-1', name: 'Aigles' },
    })

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Votre équipe arbitre ce match')
    const button = screen.getByRole('button', { name: "Accéder à l'arbitrage" })
    expect(alert).not.toContainElement(button)

    fireEvent.click(button)

    expect(navigateMock).toHaveBeenCalledWith(
      TEAM_REFEREE_GAME_PATH.replace(':id', 'game-2'),
    )
  })

  it('should not render an arbitration action for a team that is not the referee', () => {
    renderCard({
      ...baseGame,
      status: GameStatus.InProgress,
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Vous serez arbitré par Pantheres')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should render a score action when teams must referee themselves', () => {
    renderCard({
      ...baseGame,
      id: 'game-3',
      referee: undefined,
      status: GameStatus.InProgress,
    })

    expect(screen.getByRole('alert')).toHaveTextContent("Les équipes doivent s'auto-arbitrer")
    const button = screen.getByRole('button', { name: 'Saisir le score' })

    fireEvent.click(button)

    expect(navigateMock).toHaveBeenCalledWith(
      TEAM_REFEREE_GAME_PATH.replace(':id', 'game-3'),
    )
  })

  it('should explain auto-arbitration without allowing score entry before the game starts', () => {
    renderCard({
      ...baseGame,
      referee: undefined,
      status: GameStatus.Scheduled,
    })

    expect(screen.getByRole('alert')).toHaveTextContent("Les équipes doivent s'auto-arbitrer")
    expect(screen.queryByRole('button', { name: 'Saisir le score' })).not.toBeInTheDocument()
  })

  it('should not render an arbitration button for scheduled games', () => {
    renderCard({
      ...baseGame,
      status: GameStatus.Scheduled,
    })

    expect(
      screen.queryByRole('button', { name: /Accéder à l'arbitrage|Continuer l'arbitrage/ }),
    ).not.toBeInTheDocument()
  })

  it('should not render an arbitration button when the game is completed', () => {
    renderCard({
      ...baseGame,
      status: GameStatus.Completed,
    })

    expect(
      screen.queryByRole('button', { name: /Accéder à l'arbitrage|Continuer l'arbitrage/ }),
    ).not.toBeInTheDocument()
  })
})
