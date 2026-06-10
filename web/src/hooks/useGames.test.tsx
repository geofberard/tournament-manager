import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { useGames } from './useGames'
import { GameStatus } from '../generated/api-client'
import * as gamesService from '../services/gamesService'

vi.mock('../services/gamesService', async () => {
  const actual = await vi.importActual<typeof gamesService>('../services/gamesService')
  return {
    ...actual,
    listGames: vi.fn(),
  }
})

const listGamesMock = vi.mocked(gamesService.listGames)

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
