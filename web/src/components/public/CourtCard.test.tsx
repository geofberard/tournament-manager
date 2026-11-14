import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildGame } from '../../test/publicFixtures'
import { CourtCard } from './CourtCard'

afterEach(() => {
  cleanup()
})

describe('CourtCard', () => {
  it('should display the live game and the next game', () => {
    const onClick = vi.fn()

    render(
      <CourtCard
        onClick={onClick}
        schedule={{
          court: 'Terrain 2',
          currentGame: buildGame({ teams: ['Aigles', 'Lions'], points: [3, 5] }),
          upcomingGames: [
            buildGame({ id: 'next', teams: ['Tigres', 'Ours'], time: new Date(2026, 5, 18, 15, 20) }),
            buildGame({ id: 'other', teams: ['Loups', 'Renards'] }),
          ],
          completedGames: [],
        }}
      />,
    )

    expect(screen.getByText('Terrain 2')).toBeInTheDocument()
    expect(screen.getByText('3 - 5')).toBeInTheDocument()
    expect(screen.getByText('Ensuite 15:20 · Tigres vs Ours · +1 autre')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voir le programme du Terrain 2' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('should display a scoreboard variant', () => {
    render(
      <CourtCard
        onClick={vi.fn()}
        variant="scoreboard"
        schedule={{
          court: 'Terrain 3',
          currentGame: buildGame({ teams: ['Aigles', 'Lions'], points: [21, 20] }),
          upcomingGames: [buildGame({ id: 'next', teams: ['Tigres', 'Ours'], time: new Date(2026, 5, 18, 15, 20) })],
          completedGames: [],
        }}
      />,
    )

    expect(screen.getByText('En direct')).toBeInTheDocument()
    expect(screen.getByText('21 - 20')).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Ensuite : 15:20 · Tigres vs Ours')).toBeInTheDocument()
  })

  it('should display an idle scoreboard', () => {
    render(
      <CourtCard
        onClick={vi.fn()}
        variant="scoreboard"
        schedule={{ court: 'Terrain 4', currentGame: null, upcomingGames: [], completedGames: [] }}
      />,
    )

    expect(screen.getByText('Pas de match en cours')).toBeInTheDocument()
    expect(screen.queryByText('En direct')).not.toBeInTheDocument()
    expect(screen.getByText('Aucun autre match prévu')).toBeInTheDocument()
  })

  it('should indicate when nothing else is planned', () => {
    render(
      <CourtCard
        onClick={vi.fn()}
        schedule={{ court: 'Terrain 1', currentGame: null, upcomingGames: [], completedGames: [] }}
      />,
    )

    expect(screen.getByText('Pas de match en cours')).toBeInTheDocument()
    expect(screen.getByText('Aucun autre match prévu')).toBeInTheDocument()
  })
})
