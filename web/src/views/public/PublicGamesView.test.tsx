import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PublicGamesView } from './PublicGamesView'
import * as useGamesHook from '../../hooks/useGames'
import { buildGame } from '../../test/publicFixtures'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesHook.useGames)

afterEach(() => {
  cleanup()
})

describe('PublicGamesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display live games then upcoming games grouped by time slot', () => {
    useGamesMock.mockReturnValue({
      games: [
        buildGame({ id: 'live', court: 'Terrain 1', position: 1, teams: ['Aigles', 'Lions'], points: [10, 8] }),
        buildGame({ id: 'later', court: 'Terrain 1', position: 2, teams: ['Tigres', 'Ours'], time: new Date(2099, 0, 1, 16, 0) }),
        buildGame({ id: 'soon', court: 'Terrain 2', position: 1, teams: ['Loups', 'Renards'], time: new Date(2099, 0, 1, 15, 20) }),
      ],
      isLoading: false,
      errorMessage: null,
    })

    render(<MemoryRouter><PublicGamesView /></MemoryRouter>)

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings).toEqual(['En ce moment', 'Prochains matchs', '15:20', '16:00'])
    expect(screen.getAllByText('Planifié')).toHaveLength(1)
    expect(screen.queryByText('En cours')).not.toBeInTheDocument()
    expect(screen.getByText('10 - 8')).toBeInTheDocument()
    expect(screen.getByText('Terrain 2 · Arbitre : auto-arbitrage')).toBeInTheDocument()
  })

  it('should display completed games with their score', () => {
    useGamesMock.mockReturnValue({
      games: [
        buildGame({ id: 'done', status: 'completed', teams: ['Aigles', 'Lions'], points: [25, 21], time: new Date(2026, 0, 1, 13, 40) }),
      ],
      isLoading: false,
      errorMessage: null,
    })

    render(<MemoryRouter><PublicGamesView /></MemoryRouter>)
    expect(screen.getByText('Aucun match à venir.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Terminés' }))

    expect(screen.getByRole('heading', { name: '13:40' })).toBeInTheDocument()
    expect(screen.getByText('25 - 21')).toBeInTheDocument()
  })

  it('should display the most recent completed games first and untimed ones last', () => {
    useGamesMock.mockReturnValue({
      games: [
        buildGame({ id: 'untimed', status: 'completed', court: 'Terrain 1', position: 1, time: undefined, points: [1, 0] }),
        buildGame({ id: 'early', status: 'completed', court: 'Terrain 1', position: 2, time: new Date(2026, 0, 1, 12, 0), points: [2, 0] }),
        buildGame({ id: 'late', status: 'completed', court: 'Terrain 2', position: 1, time: new Date(2026, 0, 1, 13, 40), points: [3, 0] }),
      ],
      isLoading: false,
      errorMessage: null,
    })

    render(<MemoryRouter><PublicGamesView /></MemoryRouter>)
    fireEvent.click(screen.getByRole('tab', { name: 'Terminés' }))

    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      '13:40',
      '12:00',
      'Horaire à définir',
    ])
  })

  it('should display a message when no game is completed', () => {
    useGamesMock.mockReturnValue({ games: [], isLoading: false, errorMessage: 'Erreur matchs' })

    render(<MemoryRouter><PublicGamesView /></MemoryRouter>)
    fireEvent.click(screen.getByRole('tab', { name: 'Terminés' }))

    expect(screen.getByText('Erreur matchs')).toBeInTheDocument()
    expect(screen.getByText('Aucun match terminé pour le moment.')).toBeInTheDocument()
  })
})
