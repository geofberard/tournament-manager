import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { AdminLoginView } from './AdminLoginView'

describe('AdminLoginView', () => {
  it('should call the login handler with credentials', async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined)

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminLoginView onLogin={onLogin} />
      </ThemeProvider>,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /nom d'utilisateur/i }), { target: { value: 'admin' } })
    const passwordInput = document.querySelector('input[type="password"]')

    expect(passwordInput).not.toBeNull()

    fireEvent.change(passwordInput!, { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(onLogin).toHaveBeenCalledWith('admin', 'admin123')
  })
})
