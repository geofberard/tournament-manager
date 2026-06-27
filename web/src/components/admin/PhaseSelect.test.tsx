import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePhaseTree, type PhaseNode } from '../../hooks/usePhaseTree'
import { PhaseSelect } from './PhaseSelect'

vi.mock('../../hooks/usePhaseTree', () => ({ usePhaseTree: vi.fn() }))

const phaseTree: PhaseNode[] = [
  {
    phase: { id: 'root', name: 'Poules', order: 1 },
    subPhases: [
      { phase: { id: 'pool-a', name: 'Poule A', order: 1, parentId: 'root', type: 'POOL' }, subPhases: [] },
      { phase: { id: 'pool-b', name: 'Poule B', order: 2, parentId: 'root', type: 'POOL' }, subPhases: [] },
    ],
  },
]

const renderSelect = (ui: ReactElement) => {
  vi.mocked(usePhaseTree).mockReturnValue({
    errorMessage: null,
    isLoading: false,
    phases: [],
    phaseTree,
  })
  render(<ThemeProvider theme={createTheme()}>{ui}</ThemeProvider>)
}

describe('PhaseSelect', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render hierarchical phases and call onChange with the selected phase', () => {
    // GIVEN
    const onChange = vi.fn()
    renderSelect(
      <PhaseSelect
        onChange={onChange}
        value=""
      />,
    )

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase' }))
    fireEvent.click(screen.getByRole('option', { name: /Poule A/ }))

    // THEN
    expect(onChange).toHaveBeenCalledWith({
      id: 'pool-a',
      name: 'Poule A',
      order: 1,
      parentId: 'root',
      type: 'POOL',
    })
  })

  it('should render hierarchical phases and an optional empty choice', () => {
    // GIVEN
    renderSelect(
      <PhaseSelect
        allowEmpty
        isPhaseDisabled={(phase) => phase.id === 'pool-b'}
        label="Phase parente"
        onChange={vi.fn()}
        value=""
      />,
    )

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase parente' }))

    // THEN
    expect(screen.getByRole('option', { name: '-- Aucune --' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Poules' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Poule A/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Poule B/ })).toHaveAttribute('aria-disabled', 'true')
  })

  it('should keep the tree visible while disabling unavailable phases', () => {
    // GIVEN
    renderSelect(
      <PhaseSelect
        isPhaseDisabled={(phase) => phase.type !== 'POOL'}
        onChange={vi.fn()}
        value=""
      />,
    )

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase' }))

    // THEN
    expect(screen.getByRole('option', { name: 'Poules' })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('option', { name: /Poule A/ })).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('should render the selected phase name from the tree', () => {
    // GIVEN
    renderSelect(
      <PhaseSelect
        onChange={vi.fn()}
        value="pool-a"
      />,
    )

    // THEN
    expect(screen.getByRole('combobox', { name: 'Phase' })).toHaveTextContent('Poule A')
  })

  it('should allow overriding the field label', () => {
    // GIVEN
    renderSelect(
      <PhaseSelect
        allowEmpty
        label="Filtrer par phase"
        onChange={vi.fn()}
        value=""
      />,
    )

    // THEN
    expect(screen.getByRole('combobox', { name: 'Filtrer par phase' })).toBeInTheDocument()
  })
})
