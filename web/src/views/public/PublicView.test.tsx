import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { PublicView } from './PublicView'

describe('PublicView', () => {
  it('should render the public hello world page', () => {
    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <PublicView />
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Zone publique')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
