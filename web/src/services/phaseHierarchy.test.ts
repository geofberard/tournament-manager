import { describe, expect, it } from 'vitest'
import type { Phase } from './apiClient'
import { getPoolPhasesInBranch, getRootPhases, resolvePhaseType } from './phaseHierarchy'

describe('getRootPhases', () => {
  it('should return ordered root phases only', () => {
    const phases: Phase[] = [
      { id: 'pool-a', name: 'Poule A', order: 1, parentId: 'pools', type: 'POOL' },
      { id: 'finals', name: 'Finales', order: 2 },
      { id: 'pools', name: 'Poules', order: 1 },
    ]

    expect(getRootPhases(phases).map((phase) => phase.id)).toEqual(['pools', 'finals'])
  })
})

describe('getPoolPhasesInBranch', () => {
  it('should return ordered pool phases at any depth under the selected root', () => {
    const phases: Phase[] = [
      { id: 'pools', name: 'Poules', order: 1 },
      { id: 'finals', name: 'Finales', order: 2, type: 'BRACKET' },
      { id: 'pool-b-parent', name: 'Apres-midi', order: 2, parentId: 'pools' },
      { id: 'pool-b', name: 'Poule B', order: 1, parentId: 'pool-b-parent', type: 'POOL' },
      { id: 'pool-a', name: 'Poule A', order: 1, parentId: 'pools', type: 'POOL' },
      { id: 'semi-final', name: 'Demi-finale', order: 1, parentId: 'finals' },
    ]

    expect(getPoolPhasesInBranch(phases, phases[0]).map((phase) => phase.id)).toEqual(['pool-a', 'pool-b'])
  })
})

describe('resolvePhaseType', () => {
  it('should use the closest typed phase in the hierarchy', () => {
    const phases: Phase[] = [
      { id: 'final-phase', name: 'Phase finale', order: 1 },
      { id: 'main', name: 'Principale', order: 1, parentId: 'final-phase', type: 'BRACKET' },
      { id: 'semi-final', name: 'Demi-finales', order: 1, parentId: 'main' },
    ]

    expect(resolvePhaseType(phases, phases[2])).toBe('BRACKET')
  })

  it('should return undefined when no phase in the branch is typed', () => {
    const phase: Phase = { id: 'root', name: 'Organisation', order: 1 }

    expect(resolvePhaseType([phase], phase)).toBeUndefined()
  })
})
