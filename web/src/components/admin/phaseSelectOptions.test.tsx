import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import { findPhaseName, renderPhaseMenuItems } from './phaseSelectOptions'

const phaseTree: PhaseNode[] = [
  {
    phase: { id: 'root', name: 'Poules', order: 1 },
    subPhases: [
      {
        phase: { id: 'pool-a', name: 'Poule A', order: 1, parentId: 'root', type: 'POOL' },
        subPhases: [],
      },
      {
        phase: { id: 'pool-b', name: 'Poule B', order: 2, parentId: 'root', type: 'POOL' },
        subPhases: [],
      },
    ],
  },
]

describe('phaseSelectOptions', () => {
  it('should render hierarchical phase options and exclude the selected branch', () => {
    render(<>{renderPhaseMenuItems(phaseTree, 'pool-b')}</>)

    expect(screen.getByRole('menuitem', { name: 'Poules' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Poule A' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Poule B' })).not.toBeInTheDocument()
  })

  it('should find a phase name recursively', () => {
    expect(findPhaseName(phaseTree, 'pool-a')).toBe('Poule A')
    expect(findPhaseName(phaseTree, 'missing')).toBeUndefined()
  })
})
