import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ManagePhaseForm } from './ManagePhaseForm'
import type { PhasePayload } from '../../services/phasesService'
import { buildPhaseTree } from '../../hooks/usePhaseTree'

const initialValue: PhasePayload = {
  details: 'Details initiaux',
  name: 'Brassage',
  order: 1,
  type: 'POOL',
}

const phases = [
  { id: 'root-phase', name: 'Phase finale', order: 1 },
  { id: 'current-phase', parentId: 'root-phase', name: 'Principale', order: 2, type: 'BRACKET' as const },
  { id: 'child-phase', parentId: 'current-phase', name: 'Finale', order: 1 },
  { id: 'other-root', name: 'Poules', order: 2 },
  { id: 'other-child', parentId: 'other-root', name: 'Poule A', order: 1, type: 'POOL' as const },
]

const renderForm = (overrides: Partial<PhasePayload> = {}) => {
  const onClose = vi.fn()
  const onSubmit = vi.fn().mockResolvedValue(undefined)

  render(
    <ThemeProvider theme={createTheme()}>
      <ManagePhaseForm
        currentPhaseId="current-phase"
        initialValue={{ ...initialValue, ...overrides }}
        onClose={onClose}
        onSubmit={onSubmit}
        phaseTree={buildPhaseTree(phases)}
        titleLabel="Titre personnalise"
      />
    </ThemeProvider>,
  )

  return { onClose, onSubmit }
}

describe('ManagePhaseForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the provided title and initial values', () => {
    // WHEN
    renderForm()

    // THEN
    expect(screen.getByRole('heading', { name: 'Titre personnalise' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Brassage')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Details initiaux')).toBeInTheDocument()
  })

  it('should submit the trimmed phase payload', async () => {
    // GIVEN
    const { onSubmit } = renderForm({ details: '  Details avec espaces  ', name: '  Brassage  ' })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        details: 'Details avec espaces',
        name: 'Brassage',
        order: 1,
        parentId: undefined,
        type: 'POOL',
      }),
    )
  })

  it('should close when clicking cancel', () => {
    // GIVEN
    const { onClose } = renderForm()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    // THEN
    expect(onClose).toHaveBeenCalled()
  })

  it('should submit an organizational phase without a type', async () => {
    const { onSubmit } = renderForm()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Type' }))
    fireEvent.click(screen.getByRole('option', { name: 'Aucun type' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      details: 'Details initiaux',
      name: 'Brassage',
      order: 1,
      parentId: undefined,
      type: undefined,
    }))
  })

  it('should allow selecting a parent other than the edited phase itself', async () => {
    const { onSubmit } = renderForm()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase parente' }))

    expect(screen.queryByRole('option', { name: 'Principale' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Finale' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Phase finale' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ parentId: 'root-phase' })))
  })

  it('should display parent choices in hierarchy order', () => {
    renderForm()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase parente' }))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual([
      'Aucune (phase racine)',
      'Phase finale',
      'Poules',
      '└Poule A',
    ])
    expect(screen.getByRole('option', { name: 'Poule A' })).toBeInTheDocument()
  })
})
