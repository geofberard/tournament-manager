import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamList } from './TeamList'

const teams = [
  { id: 'team-1', name: 'Éperviers' },
  { id: 'team-2', name: 'Tigres' },
  { id: 'team-3', name: 'Aigles' },
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
    expect(screen.getByText('Éperviers')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.queryByText('team-1')).not.toBeInTheDocument()
  })

  it('should filter teams ignoring case and accents, then clear the search', () => {
    // GIVEN
    renderList()

    // WHEN
    fireEvent.change(screen.getByRole('textbox', { name: 'Rechercher une équipe' }), {
      target: { value: 'eper' },
    })

    // THEN
    expect(screen.getByText('Éperviers')).toBeInTheDocument()
    expect(screen.queryByText('Tigres')).not.toBeInTheDocument()
    expect(screen.getByText('1 résultat sur 3')).toBeInTheDocument()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Effacer la recherche' }))

    // THEN
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByText('3 équipes')).toBeInTheDocument()
  })

  it('should sort teams in both directions', () => {
    // GIVEN
    renderList()
    const listItems = () => screen.getAllByRole('listitem').map((item) => item.getAttribute('data-team-name'))

    // THEN
    expect(listItems()).toEqual(['Aigles', 'Éperviers', 'Tigres'])

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Tri actuel A à Z. Inverser en Z à A' }))

    // THEN
    expect(listItems()).toEqual(['Tigres', 'Éperviers', 'Aigles'])
  })

  it('should display an empty search state', () => {
    // GIVEN
    renderList()

    // WHEN
    fireEvent.change(screen.getByRole('textbox', { name: 'Rechercher une équipe' }), {
      target: { value: 'Lions' },
    })

    // THEN
    expect(screen.getByText('Aucune équipe trouvée')).toBeInTheDocument()
    expect(screen.getByText('0 résultat sur 3')).toBeInTheDocument()
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

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer Aigles' }))
    const dialog = screen.getByRole('dialog', { name: 'Supprimer ?' })

    // WHEN
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    // THEN
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(teams[2])
    })
  })
})
