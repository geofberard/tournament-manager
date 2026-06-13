import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamList } from './TeamList'

const teams = [
  { id: 'team-1', name: 'Aigles' },
  { id: 'team-2', name: 'Tigres' },
]

const renderList = () => {
  const onDelete = vi.fn().mockResolvedValue(undefined)
  const onEdit = vi.fn()

  render(
    <ThemeProvider theme={createTheme()}>
      <TeamList onDelete={onDelete} onEdit={onEdit} teams={teams} />
    </ThemeProvider>,
  )

  return { onDelete, onEdit }
}

describe('TeamList', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render team names without their identifiers', () => {
    // WHEN
    renderList()

    // THEN
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.queryByText('team-1')).not.toBeInTheDocument()
  })

  it('should expose the selected team when editing', () => {
    // GIVEN
    const { onEdit } = renderList()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Editer Tigres' }))

    // THEN
    expect(onEdit).toHaveBeenCalledWith(teams[1])
  })

  it('should expose the selected team when deleting after confirmation', async () => {
    // GIVEN
    const { onDelete } = renderList()

    fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0])
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(teams[0])
    })
  })
})
