import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhaseAccordion } from './PhaseAccordion'
import type { Phase } from '../../services/phasesService'

const phase: Phase = {
  details: '# Details\n\nTexte en **gras**.',
  id: 'phase-1',
  name: 'Brassage',
  order: 1,
  type: 'POOL',
}

const renderPhaseView = (overrides: Partial<Phase> = {}) => {
  const onChange = vi.fn()
  const onDelete = vi.fn().mockResolvedValue(undefined)
  const onEdit = vi.fn()
  const renderedPhase = { ...phase, ...overrides }

  render(
    <ThemeProvider theme={createTheme()}>
      <PhaseAccordion expanded onChange={onChange} onDelete={onDelete} onEdit={onEdit} phase={renderedPhase} />
    </ThemeProvider>,
  )

  return { onChange, onDelete, onEdit, phase: renderedPhase }
}

describe('PhaseAccordion', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the phase summary and markdown details', () => {
    // WHEN
    renderPhaseView()

    // THEN
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByText('Poules')).toBeInTheDocument()
    expect(screen.getByText('Details').tagName).toBe('H4')
    expect(screen.getByText('gras').tagName).toBe('STRONG')
  })

  it('should expose the selected phase when editing', () => {
    // GIVEN
    const { onEdit, phase: renderedPhase } = renderPhaseView()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Editer' }))

    // THEN
    expect(onEdit).toHaveBeenCalledWith(renderedPhase)
  })

  it('should expose the selected phase when deleting after confirmation', async () => {
    // GIVEN
    const { onDelete, phase: renderedPhase } = renderPhaseView()

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(renderedPhase)
    })
  })

  it('should render an empty details state', () => {
    // WHEN
    renderPhaseView({ details: '' })

    // THEN
    expect(screen.getByText('Aucun detail renseigne.')).toBeInTheDocument()
  })
})
