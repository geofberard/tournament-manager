import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NavigationMenu } from './NavigationMenu'

describe('NavigationMenu', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render title, pages and action button from props', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <NavigationMenu
          title="Espace équipe"
          subtitle="Tigres"
          currentPath="/results"
          onNavigate={vi.fn()}
          onActionClick={vi.fn()}
          actionLabel="Changer d'équipe"
          pages={[
            { label: 'Resultats', path: '/results' },
            { label: 'Matchs', path: '/games' },
          ]}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Changer d'équipe" })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resultats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Matchs' })).toBeInTheDocument()
  })

  it('should navigate from the mobile drawer', () => {
    const onNavigate = vi.fn()

    render(
      <ThemeProvider theme={createTheme()}>
        <NavigationMenu
          title="Espace équipe"
          subtitle="Tigres"
          currentPath="/results"
          onNavigate={onNavigate}
          onActionClick={vi.fn()}
          actionLabel="Changer d'équipe"
          pages={[
            { label: 'Resultats', path: '/results' },
            { label: 'Matchs', path: '/games' },
          ]}
        />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Ouvrir le menu' })[0])
    fireEvent.click(screen.getAllByText('Matchs')[0])

    expect(onNavigate).toHaveBeenCalledWith('/games')
  })
})
