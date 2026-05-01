import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { useRankings } from './useRankings'
import * as statisticsService from '../services/statisticsService'
import * as teamsService from '../services/teamsService'

vi.mock('../services/statisticsService', async () => {
  const actual = await vi.importActual<typeof statisticsService>('../services/statisticsService')
  return {
    ...actual,
    listPoolRankings: vi.fn(),
  }
})

vi.mock('../services/teamsService', async () => {
  const actual = await vi.importActual<typeof teamsService>('../services/teamsService')
  return {
    ...actual,
    getTeamPool: vi.fn(),
  }
})

const listPoolRankingsMock = vi.mocked(statisticsService.listPoolRankings)
const getTeamPoolMock = vi.mocked(teamsService.getTeamPool)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('useRankings', () => {
  it('should load rankings from the service', async () => {
    getTeamPoolMock.mockResolvedValueOnce({ id: 'Poule A' })
    listPoolRankingsMock.mockResolvedValueOnce([
      {
        contestant: { id: 'team-1', name: 'Aigles' },
        played: 3,
        won: 2,
        drawn: 0,
        lost: 1,
        score: 6,
        pointsFor: 63,
        pointsAgainst: 51,
        pointsDiff: 12,
      },
    ])

    const { result } = renderHook(() => useRankings('team-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.errorMessage).toBeNull()
    expect(result.current.poolName).toBe('Poule A')
    expect(result.current.rankings).toEqual([
      {
        contestant: { id: 'team-1', name: 'Aigles' },
        played: 3,
        won: 2,
        drawn: 0,
        lost: 1,
        score: 6,
        pointsFor: 63,
        pointsAgainst: 51,
        pointsDiff: 12,
      },
    ])
  })

  it('should expose the service error message when the request fails', async () => {
    getTeamPoolMock.mockRejectedValueOnce(new Error('Poule indisponible'))

    const { result } = renderHook(() => useRankings('team-1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.rankings).toEqual([])
    expect(result.current.errorMessage).toBe('Poule indisponible')
  })
})
