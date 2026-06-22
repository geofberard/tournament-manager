import { describe, expect, it } from 'vitest'
import type { Phase } from './apiClient'
import { resolvePhaseType } from './phaseHierarchy'

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
