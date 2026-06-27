import { render, screen, within } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  TEAM_BUVETTE_PATH,
  TEAM_GAMES_PATH,
  TEAM_RESULTS_PATH,
  TEAM_TERRAINS_PATH,
  teamRoutes,
} from '../../app/routes'
import { TeamHomeView } from './TeamHomeView'

const renderView = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter>
        <TeamHomeView currentTeam={{ id: 'team-1', name: 'Tigres' }} />
      </MemoryRouter>
    </ThemeProvider>,
  )

describe('TeamHomeView', () => {
  it('should present the team sections with links', () => {
    renderView()

    expect(screen.getByRole('heading', { name: 'Bienvenue Tigres' })).toBeInTheDocument()

    const section = screen.getByRole('region', { name: 'Sections équipe' })

    expect(within(section).getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(
      teamRoutes.map((route) => route.label),
    )

    expect(within(section).getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: 'Ouvrir matchs' })).toHaveAttribute(
      'href',
      TEAM_GAMES_PATH,
    )

    expect(within(section).getByRole('heading', { name: 'Résultats' })).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: 'Ouvrir résultats' })).toHaveAttribute(
      'href',
      TEAM_RESULTS_PATH,
    )

    expect(within(section).getByRole('heading', { name: 'Plan' })).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: 'Ouvrir plan' })).toHaveAttribute(
      'href',
      TEAM_TERRAINS_PATH,
    )

    expect(within(section).getByRole('heading', { name: 'Buvette' })).toBeInTheDocument()
    expect(within(section).getByRole('link', { name: 'Ouvrir buvette' })).toHaveAttribute(
      'href',
      TEAM_BUVETTE_PATH,
    )
  })
})
