import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { AdminView } from './AdminView'

describe('AdminView', () => {
  it('should render the admin page and allow logout', () => {
    const onLogout = vi.fn()

    render(
      <ThemeProvider theme={createTheme()}>
        <AdminView onLogout={onLogout} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Zone admin')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }))

    expect(onLogout).toHaveBeenCalledOnce()
  })
})
