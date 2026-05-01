import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamAppShell } from './TeamAppShell'

describe('TeamAppShell', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the shared menu and page content', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <TeamAppShell
          currentPath="/"
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          onChangeTeam={vi.fn()}
          onNavigate={vi.fn()}
          routes={[
            { label: 'Classement', path: '/classement' },
            { label: 'Matchs', path: '/matchs' },
          ]}
        >
          <div>Contenu de page</div>
        </TeamAppShell>
      </ThemeProvider>,
    )

    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(screen.getByText('Contenu de page')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Changer d'équipe" })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Classement' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Matchs' })).toBeInTheDocument()
  })

  it('should open the mobile drawer and navigate from it', () => {
    const onNavigate = vi.fn()

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamAppShell
          currentPath="/"
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          onChangeTeam={vi.fn()}
          onNavigate={onNavigate}
          routes={[
            { label: 'Classement', path: '/classement' },
            { label: 'Matchs', path: '/matchs' },
          ]}
        >
          <div>Contenu de page</div>
        </TeamAppShell>
      </ThemeProvider>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Ouvrir le menu' })[0])
    fireEvent.click(screen.getAllByText('Matchs')[0])

    expect(onNavigate).toHaveBeenCalledWith('/matchs')
  })
})
