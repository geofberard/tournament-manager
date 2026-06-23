import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import { PhaseTreeRoot } from './PhaseTreeRoot'

const nodes: PhaseNode[] = [
  {
    phase: { id: 'pools', name: 'Poules de brassage', order: 1, details: 'Phase de **brassage**.' },
    subPhases: [
      {
        phase: { id: 'pool-a', name: 'Poule A', order: 1, parentId: 'pools', type: 'POOL' },
        subPhases: undefined,
      },
    ],
  },
  {
    phase: { id: 'finals', name: 'Phase finale', order: 2 },
    subPhases: undefined,
  },
]

describe('PhaseTreeRoot', () => {
  afterEach(cleanup)

  it('should render roots as accordions and children as phase tree items', () => {
    render(<PhaseTreeRoot nodes={nodes} onDelete={vi.fn()} onEdit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Poules de brassage Organisation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Phase finale Organisation' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Poules de brassage Organisation' }))

    expect(screen.getByText('brassage').tagName).toBe('STRONG')
    expect(screen.getByRole('region', { name: 'Organisation de Poules de brassage' })).toBeInTheDocument()
    expect(screen.getByLabelText("Éléments de l'organisation de Poules de brassage")).toBeInTheDocument()
    expect(screen.getByText('Poule A')).toBeInTheDocument()
  })
})
