import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PitchStatus } from './PitchStatus'
import type { Game } from '../../services/gamesService'

describe('PitchStatus', () => {
  it('should display a message when there are no games', () => {
    render(<PitchStatus games={[]} />)
    expect(screen.getByText('Aucun match planifié sur les terrains.')).toBeInTheDocument()
  })

  it('should group games by pitch and display current and upcoming matches', () => {
    const games: Game[] = [
      {
        id: 'game-1',
        position: 1,
        court: 'Terrain 1',
        status: 'scheduled',
        time: new Date('2020-06-18T10:00:00Z'),
        contestants: new Set([{ id: 't1', name: 'Aigles' }, { id: 't2', name: 'Lions' }]),
        referee: { id: 't7', name: 'Panthères' },
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 },
        score: { pointsByTeam: {} },
      },
      {
        id: 'game-2',
        position: 2,
        court: 'Terrain 1',
        status: 'scheduled',
        time: new Date('2099-06-18T12:00:00Z'),
        contestants: new Set([{ id: 't3', name: 'Tigres' }, { id: 't4', name: 'Ours' }]),
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 },
        score: { pointsByTeam: {} },
      },
      {
        id: 'game-3',
        position: 3,
        court: 'Terrain 2',
        status: 'completed',
        time: new Date('2026-06-18T08:00:00Z'),
        contestants: new Set([{ id: 't5', name: 'Loups' }, { id: 't6', name: 'Renards' }]),
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 },
        score: { pointsByTeam: {} },
      },
    ]

    render(<PitchStatus games={games} />)

    // Terrain 1
    expect(screen.getByText('Terrain 1')).toBeInTheDocument()
    expect(screen.getByText('Aigles vs Lions')).toBeInTheDocument()
    expect(screen.getByText('Arbitre : Panthères')).toBeInTheDocument()
    expect(screen.getByText(/Tigres vs Ours/)).toBeInTheDocument()
    expect(screen.getByText('Arbitre : auto-arbitrage')).toBeInTheDocument()

    // Terrain 2 only has a completed game, so it should not be displayed
    expect(screen.queryByText('Terrain 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Loups vs Renards')).not.toBeInTheDocument()
  })
})
