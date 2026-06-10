import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DeleteButton } from './DeleteButton'

describe('DeleteButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('should call the confirm action after confirmation', async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })
    expect(within(dialog).getByText('Confirmez-vous la suppression ?')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should not call the confirm action when deletion is cancelled', async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Annuler' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(handleConfirm).not.toHaveBeenCalled()
  })

  it('should display an error when the confirm action fails', async () => {
    const handleConfirm = vi.fn().mockRejectedValue(new Error('Boom'))
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    expect(await within(dialog).findByText('Impossible de supprimer pour le moment.')).toBeInTheDocument()
  })
})
