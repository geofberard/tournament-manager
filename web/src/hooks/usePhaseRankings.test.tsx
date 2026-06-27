import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { usePhaseRankings } from './usePhaseRankings'
import * as statisticsService from '../services/statisticsService'

vi.mock('../services/statisticsService', () => ({ listPhaseRankings: vi.fn() }))

describe('usePhaseRankings', () => {
  it('loads rankings for the selected phase', async () => {
    vi.mocked(statisticsService.listPhaseRankings).mockResolvedValue([])
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
    )
    const { result } = renderHook(() => usePhaseRankings('phase-1'), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(statisticsService.listPhaseRankings).toHaveBeenCalledWith('phase-1')
  })
})
