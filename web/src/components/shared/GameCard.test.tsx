import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { GameCard } from './GameCard'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'

const renderCard = (game: Game) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <GameCard game={game} />
    </ThemeProvider>,
  )

const baseGame: Game = {
  id: 'game-1',
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
  })

  it('should render contestants, status, score and referee', () => {
    renderCard(baseGame)

    expect(screen.getByText('Aigles vs Tigres')).toBeInTheDocument()
    expect(screen.getByText('Termine')).toBeInTheDocument()
    expect(screen.getByText('Score:')).toBeInTheDocument()
    expect(screen.getByText('21 - 18')).toBeInTheDocument()
    expect(screen.getByText('Arbitre: Pantheres')).toBeInTheDocument()
    expect(screen.getByText(/Terrain Central/)).toBeInTheDocument()
  })

  it('should omit the referee block when no referee is provided', () => {
    const { container } = renderCard({
      ...baseGame,
      referee: undefined,
    })

    expect(container).not.toHaveTextContent('Arbitre:')
  })

  it('should render missing scores as dashes', () => {
    renderCard({
      ...baseGame,
      score: {
        pointsByTeam: {
          'team-1': 21,
        },
      },
    })

    expect(screen.getByText('21 - -')).toBeInTheDocument()
  })
})
