import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { AdminView } from './AdminView'

describe('AdminView', () => {
  it('should render the admin page and allow logout', () => {
    const onLogout = vi.fn().mockResolvedValue(undefined)

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminView onLogout={onLogout} username="admin" />
      </ThemeProvider>,
    )

    expect(screen.getByText('Zone admin')).toBeInTheDocument()
    expect(screen.getByText('Connecté en tant que admin')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }))

    expect(onLogout).toHaveBeenCalledOnce()
  })
})
