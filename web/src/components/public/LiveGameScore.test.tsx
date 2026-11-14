import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { buildGame } from '../../test/publicFixtures'
import { LiveGameScore } from './LiveGameScore'

afterEach(() => {
  cleanup()
})

describe('LiveGameScore', () => {
  it('should display a message when no game is in progress', () => {
    render(<LiveGameScore game={null} />)

    expect(screen.getByText('Pas de match en cours')).toBeInTheDocument()
  })

  it('should display teams, referee and live score', () => {
    const game = buildGame({ teams: ['Aigles', 'Lions'], points: [12, 9], referee: { id: 'r', name: 'Tigres' } })

    render(<LiveGameScore game={game} size="large" />)

    expect(screen.getByText('En direct')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Lions')).toBeInTheDocument()
    expect(screen.getByText('12 - 9')).toBeInTheDocument()
    expect(screen.getByText('Arbitre : Tigres')).toBeInTheDocument()
  })

  it('should display vs when no score has been entered', () => {
    render(<LiveGameScore game={buildGame()} />)

    expect(screen.getByText('vs')).toBeInTheDocument()
    expect(screen.getByText('Arbitre : auto-arbitrage')).toBeInTheDocument()
  })
})
