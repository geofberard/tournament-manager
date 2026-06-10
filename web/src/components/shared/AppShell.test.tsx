import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the shared menu and page content', () => {
    // WHEN
    render(
      <ThemeProvider theme={createTheme()}>
        <AppShell
          title="Espace équipe"
          subtitle="Tigres"
          pages={[
            { label: 'Resultats', path: '/results' },
            { label: 'Matchs', path: '/games' },
          ]}
          currentPath="/results"
          onNavigate={vi.fn()}
          actionLabel="Changer d'équipe"
          onActionClick={vi.fn()}
        >
          <div>Contenu de page</div>
        </AppShell>
      </ThemeProvider>,
    )

    // THEN
    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(screen.getByText('Contenu de page')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Changer d'équipe" })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resultats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Matchs' })).toBeInTheDocument()
  })

  it('should open the mobile drawer and navigate from it', () => {
    // GIVEN
    const onNavigate = vi.fn()

    render(
      <ThemeProvider theme={createTheme()}>
        <AppShell
          title="Espace équipe"
          subtitle="Tigres"
          pages={[
            { label: 'Resultats', path: '/results' },
            { label: 'Matchs', path: '/games' },
          ]}
          currentPath="/results"
          onNavigate={onNavigate}
          actionLabel="Changer d'équipe"
          onActionClick={vi.fn()}
        >
          <div>Contenu de page</div>
        </AppShell>
      </ThemeProvider>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Ouvrir le menu' })[0])

    // WHEN
    fireEvent.click(screen.getAllByText('Matchs')[0])

    // THEN
    expect(onNavigate).toHaveBeenCalledWith('/games')
  })
})
