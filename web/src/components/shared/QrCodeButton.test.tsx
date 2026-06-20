import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { QrCodeButton } from './QrCodeButton'

describe('QrCodeButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the button and open the dialog on click', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <QrCodeButton />
      </ThemeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(button)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByAltText('QR Code du tournoi')).toBeInTheDocument()
  })
})
