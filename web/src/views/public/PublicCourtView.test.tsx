import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PublicCourtView } from './PublicCourtView'
import * as useGamesHook from '../../hooks/useGames'
import { buildGame } from '../../test/publicFixtures'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesHook.useGames)

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/public" element={<div>Liste des terrains</div>} />
        <Route path="/public/terrains/:court" element={<PublicCourtView />} />
      </Routes>
    </MemoryRouter>,
  )

afterEach(() => {
  cleanup()
})

describe('PublicCourtView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGamesMock.mockReturnValue({
      games: [
        buildGame({ id: 'g1', court: 'Terrain 1', teams: ['Aigles', 'Lions'], position: 1 }),
        buildGame({ id: 'g2', court: 'Terrain 1', teams: ['Tigres', 'Ours'], position: 2 }),
        buildGame({ id: 'g3', court: 'Terrain 2', teams: ['Loups', 'Renards'], position: 1 }),
      ],
      isLoading: false,
      errorMessage: null,
    })
  })

  it('should display the schedule of the requested court', () => {
    renderAt('/public/terrains/Terrain%201')

    expect(screen.getByRole('heading', { name: 'Terrain 1' })).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('À venir sur ce terrain (1)')).toBeInTheDocument()
    expect(screen.getByText(/Tigres/)).toBeInTheDocument()
  })

  it('should switch to another court', () => {
    renderAt('/public/terrains/Terrain%201')

    fireEvent.click(screen.getByRole('tab', { name: 'Terrain 2' }))

    expect(screen.getByRole('heading', { name: 'Terrain 2' })).toBeInTheDocument()
    expect(screen.getByText('Loups')).toBeInTheDocument()
  })

  it('should go back to the courts list', () => {
    renderAt('/public/terrains/Terrain%201')

    fireEvent.click(screen.getByRole('button', { name: 'Tous les terrains' }))

    expect(screen.getByText('Liste des terrains')).toBeInTheDocument()
  })

  it('should display a message for an unknown court', () => {
    renderAt('/public/terrains/Inconnu')

    expect(screen.getByText("Aucun match n'est prévu sur ce terrain.")).toBeInTheDocument()
  })
})
