import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DeleteButton } from './DeleteButton'
import { UserFacingError } from '../../services/apiError'

describe('DeleteButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('should call the confirm action after confirmation', async () => {
    // GIVEN
    const handleConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })
    expect(within(dialog).getByText('Confirmez-vous la suppression ?')).toBeInTheDocument()

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should not call the confirm action when deletion is cancelled', async () => {
    // GIVEN
    const handleConfirm = vi.fn().mockResolvedValue(undefined)
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    // WHEN
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Annuler' }))

    // THEN
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(handleConfirm).not.toHaveBeenCalled()
  })

  it('should display an error when the confirm action fails', async () => {
    // GIVEN
    const handleConfirm = vi.fn().mockRejectedValue(new Error('Boom'))
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    expect(await within(dialog).findByText('Impossible de supprimer pour le moment.')).toBeInTheDocument()
  })

  it('should display a user-facing deletion explanation', async () => {
    // GIVEN
    const handleConfirm = vi.fn().mockRejectedValue(
      new UserFacingError('Cette équipe participe encore à un match.'),
    )
    render(<DeleteButton onConfirm={handleConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    expect(await within(dialog).findByText('Cette équipe participe encore à un match.')).toBeInTheDocument()
  })
})
