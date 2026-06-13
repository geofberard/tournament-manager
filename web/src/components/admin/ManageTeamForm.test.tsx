import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ManageTeamForm } from './ManageTeamForm'

const renderForm = (name = 'Aigles') => {
  const onClose = vi.fn()
  const onSubmit = vi.fn().mockResolvedValue(undefined)

  render(
    <ThemeProvider theme={createTheme()}>
      <ManageTeamForm
        initialValue={{ name }}
        onClose={onClose}
        onSubmit={onSubmit}
        titleLabel="Titre personnalise"
      />
    </ThemeProvider>,
  )

  return { onClose, onSubmit }
}

describe('ManageTeamForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the provided title and initial value', () => {
    // WHEN
    renderForm()

    // THEN
    expect(screen.getByRole('heading', { name: 'Titre personnalise' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Aigles')).toBeInTheDocument()
  })

  it('should submit the trimmed team name', async () => {
    // GIVEN
    const { onSubmit } = renderForm('  Aigles  ')

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Aigles' })
    })
  })

  it('should display the submission error and enable actions again', async () => {
    // GIVEN
    const { onSubmit } = renderForm()
    onSubmit.mockRejectedValueOnce(new Error('Nom deja utilise'))

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    expect(await screen.findByText('Nom deja utilise')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sauvegarder' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Annuler' })).toBeEnabled()
  })

  it('should close when clicking cancel', () => {
    // GIVEN
    const { onClose } = renderForm()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    // THEN
    expect(onClose).toHaveBeenCalledOnce()
  })
})
