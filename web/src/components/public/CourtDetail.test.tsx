import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildGame } from '../../test/publicFixtures'
import { CourtDetail } from './CourtDetail'

afterEach(() => {
  cleanup()
})

describe('CourtDetail', () => {
  it('should display current, upcoming and completed games of the court', () => {
    render(
      <CourtDetail
        courts={['Terrain 1', 'Terrain 2']}
        onSelectCourt={vi.fn()}
        layout="split"
        schedule={{
          court: 'Terrain 1',
          currentGame: buildGame({ id: 'live', teams: ['Aigles', 'Lions'] }),
          upcomingGames: [buildGame({ id: 'next', teams: ['Tigres', 'Ours'] })],
          completedGames: [buildGame({ id: 'done', teams: ['Loups', 'Renards'], points: [25, 23], status: 'completed' })],
        }}
      />,
    )

    expect(screen.getByText('En direct')).toBeInTheDocument()
    expect(screen.getByText('À venir sur ce terrain (1)')).toBeInTheDocument()
    expect(screen.getByText(/Tigres/)).toBeInTheDocument()
    expect(screen.queryByText('Planifié')).not.toBeInTheDocument()
    expect(screen.getByText('Terminés')).toBeInTheDocument()
    expect(screen.getByText('25 - 23')).toBeInTheDocument()
  })

  it('should allow switching to another court', () => {
    const onSelectCourt = vi.fn()

    render(
      <CourtDetail
        courts={['Terrain 1', 'Terrain 2']}
        onSelectCourt={onSelectCourt}
        schedule={{ court: 'Terrain 1', currentGame: null, upcomingGames: [], completedGames: [] }}
      />,
    )

    expect(screen.getByRole('tab', { name: 'Terrain 1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Aucun match à venir')).toBeInTheDocument()
    expect(screen.queryByText('Terminés')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Terrain 2' }))
    expect(onSelectCourt).toHaveBeenCalledWith('Terrain 2')
  })
})
