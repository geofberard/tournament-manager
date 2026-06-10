import { renderHook, waitFor } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePhases } from './usePhases'
import * as phasesService from '../services/phasesService'

vi.mock('../services/phasesService', async () => {
  const actual = await vi.importActual<typeof phasesService>('../services/phasesService')
  return {
    ...actual,
    listPhases: vi.fn(),
  }
})

const listPhasesMock = vi.mocked(phasesService.listPhases)

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
  }
}

describe('usePhases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load phases from the service', async () => {
    // GIVEN
    listPhasesMock.mockResolvedValueOnce([
      { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
      { id: 'phase-2', name: 'Principale', order: 2, type: 'BRACKET' },
    ])

    // WHEN
    const { result } = renderHook(() => usePhases(), { wrapper: createWrapper() })

    // THEN
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.errorMessage).toBeNull()
    expect(result.current.phases.map((phase) => phase.id)).toEqual(['phase-1', 'phase-2'])
  })

  it('should expose the service error message when loading phases fails', async () => {
    // GIVEN
    listPhasesMock.mockRejectedValueOnce(new Error('Phases indisponibles'))

    // WHEN
    const { result } = renderHook(() => usePhases(), { wrapper: createWrapper() })

    // THEN
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.phases).toEqual([])
    expect(result.current.errorMessage).toBe('Phases indisponibles')
  })
})
