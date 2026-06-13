import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminCreateFab } from './AdminCreateFab'

const renderFab = (disabled = false, onClick = vi.fn()) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <AdminCreateFab disabled={disabled} label="Ajouter une equipe" onClick={onClick} />
    </ThemeProvider>,
  )

describe('AdminCreateFab', () => {
  afterEach(() => {
    cleanup()
  })

  it('should trigger the creation action', () => {
    // GIVEN
    const onClick = vi.fn()
    renderFab(false, onClick)

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une equipe' }))

    // THEN
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('should display the action label on hover', async () => {
    // GIVEN
    renderFab()

    // WHEN
    fireEvent.mouseOver(screen.getByRole('button', { name: 'Ajouter une equipe' }))

    // THEN
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Ajouter une equipe')
  })

  it('should not trigger the creation action when disabled', () => {
    // GIVEN
    const onClick = vi.fn()
    renderFab(true, onClick)

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter une equipe' }))

    // THEN
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Ajouter une equipe' })).toBeDisabled()
  })
})
