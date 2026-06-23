import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePhaseTree } from './usePhaseTree'
import { usePhases } from './usePhases'

vi.mock('./usePhases', () => ({
  usePhases: vi.fn(),
}))

const usePhasesMock = vi.mocked(usePhases)

describe('usePhaseTree', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should transform flat phases into an ordered tree', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'final', name: 'Finale', order: 2, parentId: 'main' },
        { id: 'root', name: 'Phase finale', order: 1 },
        { id: 'main', name: 'Principale', order: 1, parentId: 'root', type: 'BRACKET' },
        { id: 'semis', name: '1/2', order: 1, parentId: 'main' },
      ],
    })

    const { result } = renderHook(() => usePhaseTree())

    expect(result.current.phaseTree).toHaveLength(1)
    expect(result.current.phaseTree[0].phase.id).toBe('root')
    expect(result.current.phaseTree[0].subPhases?.[0].phase.id).toBe('main')
    expect(result.current.phaseTree[0].subPhases?.[0].subPhases?.map((node) => node.phase.id))
      .toEqual(['semis', 'final'])
  })
})
