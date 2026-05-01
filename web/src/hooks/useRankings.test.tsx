import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { useRankings } from './useRankings'
import * as statisticsService from '../services/statisticsService'

vi.mock('../services/statisticsService', async () => {
  const actual = await vi.importActual<typeof statisticsService>('../services/statisticsService')
  return {
    ...actual,
    listRankings: vi.fn(),
  }
})

const listRankingsMock = vi.mocked(statisticsService.listRankings)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('useRankings', () => {
  it('should load rankings from the service', async () => {
    listRankingsMock.mockResolvedValueOnce([
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

    const { result } = renderHook(() => useRankings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.errorMessage).toBeNull()
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
    listRankingsMock.mockRejectedValueOnce(new Error('Classement indisponible'))

    const { result } = renderHook(() => useRankings(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.rankings).toEqual([])
    expect(result.current.errorMessage).toBe('Classement indisponible')
  })
})
