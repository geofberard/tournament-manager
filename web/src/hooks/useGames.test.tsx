import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { useGame, useGames } from './useGames'
import { GameStatus } from '../generated/api-client'
import * as gamesService from '../services/gamesService'

vi.mock('../services/gamesService', async () => {
  const actual = await vi.importActual<typeof gamesService>('../services/gamesService')
  return {
    ...actual,
    listGames: vi.fn(),
    getGameById: vi.fn(),
  }
})

const listGamesMock = vi.mocked(gamesService.listGames)
const getGameByIdMock = vi.mocked(gamesService.getGameById)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('useGames', () => {
  it('should load and sort games by ascending date', async () => {
    // GIVEN
    listGamesMock.mockResolvedValueOnce([
      {
        id: 'game-2',
        phase: { id: 'phase-2', name: 'Principale', order: 2, type: 'POOL' },
        group: 'Poule B',
        time: new Date('2026-05-02T10:00:00Z'),
        court: 'Annexe',
        status: GameStatus.Scheduled,
        contestants: new Set([{ id: 'team-1', name: 'Aigles' }]),
        referee: undefined,
        score: { pointsByTeam: {} },
      },
      {
        id: 'game-1',
        phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
        group: 'Poule A',
        time: new Date('2026-05-01T18:30:00Z'),
        court: 'Central',
        status: GameStatus.Completed,
        contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        referee: undefined,
        score: { pointsByTeam: {} },
      },
    ])

    // WHEN
    const { result } = renderHook(() => useGames(), { wrapper: createWrapper() })

    // THEN
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.errorMessage).toBeNull()
    expect(result.current.games.map((game) => game.id)).toEqual(['game-1', 'game-2'])
  })

  it('should expose the service error message when the request fails', async () => {
    // GIVEN
    listGamesMock.mockRejectedValueOnce(new Error('API indisponible'))

    // WHEN
    const { result } = renderHook(() => useGames(), { wrapper: createWrapper() })

    // THEN
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.games).toEqual([])
    expect(result.current.errorMessage).toBe('API indisponible')
  })
})

describe('useGame', () => {
  it('should load a single game by id', async () => {
    getGameByIdMock.mockResolvedValueOnce({
      id: 'game-1',
      phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
      group: 'Poule A',
      time: new Date('2026-05-01T18:30:00Z'),
      court: 'Central',
      status: GameStatus.Scheduled,
      contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
      referee: undefined,
      score: { pointsByTeam: {} },
    })

    const { result } = renderHook(() => useGame('game-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.errorMessage).toBeNull()
    expect(result.current.game?.id).toBe('game-1')
  })

  it('should expose the match error message when the single game request fails', async () => {
    getGameByIdMock.mockRejectedValueOnce(new Error('Match introuvable'))

    const { result } = renderHook(() => useGame('game-42'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.game).toBeNull()
    expect(result.current.errorMessage).toBe('Match introuvable')
  })
})
