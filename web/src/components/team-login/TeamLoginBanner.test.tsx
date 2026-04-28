import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { TeamLoginBanner } from './TeamLoginBanner'

describe('TeamLoginBanner', () => {
  it('should render the tournament title and SCUF logo', () => {
    // When
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamLoginBanner />
      </ThemeProvider>,
    )

    // Then
    expect(screen.getByText('Tournois')).toBeInTheDocument()
    expect(screen.getByAltText('SCUF')).toBeInTheDocument()
  })
})
