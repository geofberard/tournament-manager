import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { buildGame } from '../../test/publicFixtures'
import { GameRow } from './GameRow'

afterEach(() => {
  cleanup()
})

describe('GameRow', () => {
  it('should display time, teams, referee and the scheduled status', () => {
    const game = buildGame({ time: new Date(2026, 5, 18, 15, 20), referee: { id: 'r', name: 'Ours' } })

    render(<GameRow game={game} status="scheduled" />)

    expect(screen.getByText('15:20')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Arbitre : Ours')).toBeInTheDocument()
    expect(screen.getByText('Planifié')).toBeInTheDocument()
  })

  it('should hide the status label but keep the score when requested', () => {
    const { rerender } = render(<GameRow game={buildGame()} status="scheduled" showStatusLabel={false} />)
    expect(screen.queryByText('Planifié')).not.toBeInTheDocument()

    rerender(<GameRow game={buildGame()} status="in_progress" showStatusLabel={false} />)
    expect(screen.queryByText('En cours')).not.toBeInTheDocument()

    rerender(<GameRow game={buildGame({ points: [3, 1] })} status="in_progress" showStatusLabel={false} />)
    expect(screen.getByText('3 - 1')).toBeInTheDocument()
  })

  it('should display the live score with the in progress color', () => {
    const game = buildGame({ points: [10, 8] })

    render(<GameRow game={game} status="in_progress" showCourt showTime={false} />)

    expect(screen.getByText('10 - 8').closest('.MuiChip-root')).toHaveClass('MuiChip-colorSuccess')
    expect(screen.getByText('Terrain 1 · Arbitre : auto-arbitrage')).toBeInTheDocument()
    expect(screen.queryByText('--:--')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Vainqueur')).not.toBeInTheDocument()
  })

  it('should highlight the winner of a completed game', () => {
    const game = buildGame({ teams: ['Aigles', 'Lions'], points: [20, 25], status: 'completed' })

    render(<GameRow game={game} status="completed" />)

    expect(screen.getByText('20 - 25').closest('.MuiChip-root')).toHaveClass('MuiChip-colorDefault')
    expect(screen.getByTitle('Vainqueur')).toBeInTheDocument()
    expect(screen.getByText('Lions')).toHaveStyle({ fontWeight: '800' })
    expect(screen.getByText('Aigles')).toHaveStyle({ fontWeight: '400' })
  })

  it('should display the status when no score is available', () => {
    render(<GameRow game={buildGame({ time: undefined, status: 'completed' })} status="completed" />)

    expect(screen.getByText('--:--')).toBeInTheDocument()
    expect(screen.getByText('Terminé')).toBeInTheDocument()
    expect(screen.queryByTitle('Vainqueur')).not.toBeInTheDocument()
  })
})
