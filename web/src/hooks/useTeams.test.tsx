import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'
import { useTeams } from './useTeams'
import * as teamsService from '../services/teamsService'

vi.mock('../services/teamsService', async () => {
  const actual = await vi.importActual<typeof teamsService>('../services/teamsService')
  return {
    ...actual,
    listTeams: vi.fn(),
  }
})

const listTeamsMock = vi.mocked(teamsService.listTeams)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('useTeams', () => {
  it('should load and sort teams alphabetically', async () => {
    // Given
    listTeamsMock.mockResolvedValueOnce([
      { id: 'team-2', name: 'Zebres' },
      { id: 'team-1', name: 'Aigles' },
    ])

    // When
    const { result } = renderHook(() => useTeams(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Then
    expect(result.current.errorMessage).toBeNull()
    expect(result.current.teams).toEqual([
      { id: 'team-1', name: 'Aigles' },
      { id: 'team-2', name: 'Zebres' },
    ])
  })

  it('should expose a readable error message when the request fails', async () => {
    // Given
    listTeamsMock.mockRejectedValueOnce(new Error('API indisponible'))

    // When
    const { result } = renderHook(() => useTeams(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Then
    expect(result.current.teams).toEqual([])
    expect(result.current.errorMessage).toBe('API indisponible')
  })
})
