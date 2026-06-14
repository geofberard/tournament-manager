import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import AddIcon from '@mui/icons-material/Add'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminCreateSpeedDial } from './AdminCreateSpeedDial'

const renderSpeedDial = (disabled = false) => {
  const createOne = vi.fn()
  const createMany = vi.fn()

  render(
    <ThemeProvider theme={createTheme()}>
      <AdminCreateSpeedDial
        actions={[
          { icon: <AddIcon />, label: 'Creer un match', onClick: createOne },
          { icon: <AddIcon />, label: 'Creer les matchs', onClick: createMany },
        ]}
        disabled={disabled}
        label="Ajouter des matchs"
      />
    </ThemeProvider>,
  )

  return { createMany, createOne }
}

describe('AdminCreateSpeedDial', () => {
  afterEach(cleanup)

  it('should display and trigger creation actions', () => {
    // GIVEN
    const { createMany } = renderSpeedDial()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter des matchs' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Creer les matchs' }))

    // THEN
    expect(createMany).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Ajouter des matchs' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('should disable the main creation action', () => {
    // GIVEN / WHEN
    renderSpeedDial(true)

    // THEN
    expect(screen.getByRole('button', { name: 'Ajouter des matchs' })).toBeDisabled()
  })
})
