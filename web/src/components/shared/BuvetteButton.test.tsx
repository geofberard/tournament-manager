import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { BuvetteButton } from './BuvetteButton'

describe('BuvetteButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('should open the food menu dialog on click', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <BuvetteButton />
      </ThemeProvider>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voir le menu de la buvette' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Menu de la buvette' })).toHaveAttribute(
      'src',
      expect.stringContaining('food.png')
    )
  })
})
