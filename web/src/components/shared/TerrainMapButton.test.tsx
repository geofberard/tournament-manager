import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { TerrainMapButton } from './TerrainMapButton'

describe('TerrainMapButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('should open the terrain map dialog on click', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <TerrainMapButton />
      </ThemeProvider>
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voir le plan des terrains' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Plan des terrains' })).toHaveAttribute(
      'src',
      expect.stringContaining('map.png')
    )
  })
})
