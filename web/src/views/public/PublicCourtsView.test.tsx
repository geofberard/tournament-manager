import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicCourtsView } from './PublicCourtsView'
import * as useGamesHook from '../../hooks/useGames'
import { buildGame, mockScreenWidth } from '../../test/publicFixtures'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesHook.useGames)

const renderView = () =>
  render(
    <MemoryRouter initialEntries={['/public']}>
      <Routes>
        <Route path="/public" element={<PublicCourtsView />} />
        <Route path="/public/terrains/:court" element={<div>Détail terrain</div>} />
      </Routes>
    </MemoryRouter>,
  )

afterEach(() => {
  cleanup()
  mockScreenWidth(false)
})

describe('PublicCourtsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display a message when no game is planned', () => {
    useGamesMock.mockReturnValue({ games: [], isLoading: false, errorMessage: null })

    renderView()

    expect(screen.getByText('Aucun match planifié sur les terrains.')).toBeInTheDocument()
  })

  it('should display a card per court and open its detail', () => {
    useGamesMock.mockReturnValue({
      games: [
        buildGame({ id: 'g1', court: 'Terrain 2', teams: ['Tigres', 'Ours'] }),
        buildGame({ id: 'g2', court: 'Terrain 1', teams: ['Aigles', 'Lions'] }),
      ],
      isLoading: false,
      errorMessage: null,
    })

    renderView()

    const cards = screen.getAllByRole('button', { name: /Voir le programme/ })
    expect(cards.map((card) => card.getAttribute('aria-label'))).toEqual([
      'Voir le programme du Terrain 1',
      'Voir le programme du Terrain 2',
    ])

    fireEvent.click(cards[0])
    expect(screen.getByText('Détail terrain')).toBeInTheDocument()
  })

  it('should display errors', () => {
    useGamesMock.mockReturnValue({ games: [], isLoading: false, errorMessage: 'Erreur matchs' })

    renderView()

    expect(screen.getByText('Erreur matchs')).toBeInTheDocument()
  })

  it('should display a loader while loading', () => {
    useGamesMock.mockReturnValue({ games: [], isLoading: true, errorMessage: null })

    renderView()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should display scoreboards on large screens', () => {
    mockScreenWidth(true)
    useGamesMock.mockReturnValue({
      games: [buildGame({ id: 'g1', court: 'Terrain 1', teams: ['Aigles', 'Lions'], points: [7, 4] })],
      isLoading: false,
      errorMessage: null,
    })

    renderView()

    expect(screen.getByText('7 - 4')).toBeInTheDocument()
    expect(screen.queryByText(/Classements/)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voir le programme du Terrain 1' }))
    expect(screen.getByText('Détail terrain')).toBeInTheDocument()
  })
})
