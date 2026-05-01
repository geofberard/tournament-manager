import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { AdminLoginView } from './AdminLoginView'

describe('AdminLoginView', () => {
  it('should call the login handler', () => {
    const onLogin = vi.fn()

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminLoginView onLogin={onLogin} />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Se connecter comme admin' }))

    expect(onLogin).toHaveBeenCalledOnce()
  })
})
