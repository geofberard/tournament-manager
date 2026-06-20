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
        court: 'Terrain 1',
        status: 'in_progress',
        time: new Date('2026-06-18T10:00:00Z'),
        contestants: new Set([{ id: 't1', name: 'Aigles' }, { id: 't2', name: 'Lions' }]),
        group: 'Poule A',
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1' },
        score: { pointsByTeam: {} },
      },
      {
        id: 'game-2',
        court: 'Terrain 1',
        status: 'scheduled',
        time: new Date('2026-06-18T12:00:00Z'),
        contestants: new Set([{ id: 't3', name: 'Tigres' }, { id: 't4', name: 'Ours' }]),
        group: 'Poule B',
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1' },
        score: { pointsByTeam: {} },
      },
      {
        id: 'game-3',
        court: 'Terrain 2',
        status: 'completed',
        time: new Date('2026-06-18T08:00:00Z'),
        contestants: new Set([{ id: 't5', name: 'Loups' }, { id: 't6', name: 'Renards' }]),
        group: 'Poule C',
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1' },
        score: { pointsByTeam: {} },
      },
    ]

    render(<PitchStatus games={games} />)

    // Terrain 1
    expect(screen.getByText('Terrain 1')).toBeInTheDocument()
    expect(screen.getByText('Aigles vs Lions')).toBeInTheDocument()
    expect(screen.getByText(/Tigres vs Ours/)).toBeInTheDocument()

    // Terrain 2
    expect(screen.getByText('Terrain 2')).toBeInTheDocument()
    expect(screen.getAllByText('Aucun match en cours').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Aucun match à venir').length).toBeGreaterThan(0)
  })
})
