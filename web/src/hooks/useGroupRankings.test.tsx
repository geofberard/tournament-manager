import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGroupRankings, usePhaseGroups } from './useGroupRankings'
import * as statisticsService from '../services/statisticsService'
import * as phasesService from '../services/phasesService'

vi.mock('../services/statisticsService', async () => {
  const actual = await vi.importActual<typeof statisticsService>('../services/statisticsService')
  return {
    ...actual,
    listGroupRankings: vi.fn(),
  }
})

vi.mock('../services/phasesService', async () => {
  const actual = await vi.importActual<typeof phasesService>('../services/phasesService')
  return {
    ...actual,
    listPhaseGroups: vi.fn(),
  }
})

const listGroupRankingsMock = vi.mocked(statisticsService.listGroupRankings)
const listPhaseGroupsMock = vi.mocked(phasesService.listPhaseGroups)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('useGroupRankings hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('usePhaseGroups', () => {
    it('should load phase groups from the service', async () => {
      // GIVEN
      listPhaseGroupsMock.mockResolvedValueOnce([{ id: 'Poule A' }, { id: 'Poule B' }])

      // WHEN
      const { result } = renderHook(() => usePhaseGroups('phase-1'), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.errorMessage).toBeNull()
      expect(result.current.groups).toEqual([{ id: 'Poule A' }, { id: 'Poule B' }])
      expect(listPhaseGroupsMock).toHaveBeenCalledWith('phase-1')
    })

    it('should expose the service error message when the request fails', async () => {
      // GIVEN
      listPhaseGroupsMock.mockRejectedValueOnce(new Error('Erreur de chargement des groupes'))

      // WHEN
      const { result } = renderHook(() => usePhaseGroups('phase-1'), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.groups).toEqual([])
      expect(result.current.errorMessage).toBe('Erreur de chargement des groupes')
    })

    it('should stay idle while no phase is selected', async () => {
      // WHEN
      const { result } = renderHook(() => usePhaseGroups(null), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(listPhaseGroupsMock).not.toHaveBeenCalled()
      expect(result.current.groups).toEqual([])
      expect(result.current.errorMessage).toBeNull()
    })
  })

  describe('useGroupRankings', () => {
    it('should load group rankings from the service', async () => {
      // GIVEN
      const mockRankings = [
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
      ]
      listGroupRankingsMock.mockResolvedValueOnce(mockRankings)

      // WHEN
      const { result } = renderHook(() => useGroupRankings('Poule A', 'phase-1'), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.errorMessage).toBeNull()
      expect(result.current.rankings).toEqual(mockRankings)
      expect(listGroupRankingsMock).toHaveBeenCalledWith('Poule A', 'phase-1')
    })

    it('should expose the service error message when the request fails', async () => {
      // GIVEN
      listGroupRankingsMock.mockRejectedValueOnce(new Error('Erreur de chargement des statistiques'))

      // WHEN
      const { result } = renderHook(() => useGroupRankings('Poule A', 'phase-1'), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.rankings).toEqual([])
      expect(result.current.errorMessage).toBe('Erreur de chargement des statistiques')
    })

    it('should stay idle while no phase or group is selected', async () => {
      // WHEN
      const { result } = renderHook(() => useGroupRankings('', null), { wrapper: createWrapper() })

      // THEN
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(listGroupRankingsMock).not.toHaveBeenCalled()
      expect(result.current.rankings).toEqual([])
      expect(result.current.errorMessage).toBeNull()
    })
  })
})
