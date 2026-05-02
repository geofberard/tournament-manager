import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { AdminView } from './AdminView'

describe('AdminView', () => {
  it('should render the admin page', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <AdminView username="admin" />
      </ThemeProvider>,
    )

    expect(screen.getByText('Zone admin')).toBeInTheDocument()
    expect(screen.getByText('Connecté en tant que admin')).toBeInTheDocument()
  })
})
