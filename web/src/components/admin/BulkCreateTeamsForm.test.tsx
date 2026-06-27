import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BulkCreateTeamsForm } from './BulkCreateTeamsForm'

const renderForm = () => {
  const onClose = vi.fn()
  const onSubmit = vi.fn().mockResolvedValue([])

  render(
    <ThemeProvider theme={createTheme()}>
      <BulkCreateTeamsForm onClose={onClose} onSubmit={onSubmit} />
    </ThemeProvider>,
  )

  return { onClose, onSubmit }
}

describe('BulkCreateTeamsForm', () => {
  afterEach(cleanup)

  it('should submit trimmed unique non-empty lines', async () => {
    const { onSubmit } = renderForm()
    fireEvent.change(screen.getByRole('textbox', { name: 'Noms des équipes' }), {
      target: { value: ' Aigles \n\nTigres\naigles' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Créer (2)' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(['Aigles', 'Tigres'])
    })
  })

  it('should retain only failed team names', async () => {
    const { onSubmit } = renderForm()
    onSubmit.mockResolvedValueOnce(['Tigres'])
    fireEvent.change(screen.getByRole('textbox', { name: 'Noms des équipes' }), {
      target: { value: 'Aigles\nTigres' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Créer (2)' }))

    expect(await screen.findByText(/1 équipe n’a pas pu être créée/)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Noms des équipes' })).toHaveValue('Tigres')
    expect(screen.getByRole('button', { name: 'Créer (1)' })).toBeEnabled()
  })
})
