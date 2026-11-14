import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { PublicInfoView } from './PublicInfoView'
import { mockScreenWidth } from '../../test/publicFixtures'

afterEach(() => {
  cleanup()
  mockScreenWidth(false)
})

describe('PublicInfoView', () => {
  it('should list the practical information', () => {
    render(<MemoryRouter initialEntries={['/public/infos']}><PublicInfoView /></MemoryRouter>)

    expect(screen.getByText('Plan des terrains')).toBeInTheDocument()
    expect(screen.getByText('Buvette')).toBeInTheDocument()
    expect(screen.getByText('Partager le tournoi')).toBeInTheDocument()
  })

  it.each([
    ['Plan des terrains', 'Plan des terrains'],
    ['Buvette', 'Menu de la buvette'],
    ['Partager le tournoi', 'QR Code du tournoi'],
  ])('should open %s in a dialog', async (title, imageAlt) => {
    render(<MemoryRouter initialEntries={['/public/infos']}><PublicInfoView /></MemoryRouter>)

    fireEvent.click(screen.getByText(title))

    expect(screen.getByRole('img', { name: imageAlt })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'fermer' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('should display tiles on large screens', () => {
    mockScreenWidth(true)
    render(<MemoryRouter initialEntries={['/public/infos']}><PublicInfoView /></MemoryRouter>)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Buvette'))

    expect(screen.getByRole('img', { name: 'Menu de la buvette' })).toBeInTheDocument()
  })
})
