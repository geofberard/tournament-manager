import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ManagePhaseForm } from './ManagePhaseForm'
import type { PhasePayload } from '../../services/phasesService'

const initialValue: PhasePayload = {
  details: 'Details initiaux',
  name: 'Brassage',
  order: 1,
  type: 'POOL',
}

const renderForm = (overrides: Partial<PhasePayload> = {}) => {
  const onClose = vi.fn()
  const onSubmit = vi.fn().mockResolvedValue(undefined)

  render(
    <ThemeProvider theme={createTheme()}>
      <ManagePhaseForm
        initialValue={{ ...initialValue, ...overrides }}
        onClose={onClose}
        onSubmit={onSubmit}
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
    renderForm()

    expect(screen.getByRole('heading', { name: 'Titre personnalise' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Brassage')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Details initiaux')).toBeInTheDocument()
  })

  it('should submit the trimmed phase payload', async () => {
    const { onSubmit } = renderForm({ details: '  Details avec espaces  ', name: '  Brassage  ' })

    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        details: 'Details avec espaces',
        name: 'Brassage',
        order: 1,
        type: 'POOL',
      }),
    )
  })

  it('should close when clicking cancel', () => {
    const { onClose } = renderForm()

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(onClose).toHaveBeenCalled()
  })
})
