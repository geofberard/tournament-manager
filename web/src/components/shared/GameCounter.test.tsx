import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, beforeEach, vi } from 'vitest'
import { AlertProvider } from '../../app/AlertProvider'
import { GameCounter } from './GameCounter'
import type { Game } from '../../services/apiClient'

const renderCounter = (game: Game) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter initialEntries={['/']}>
        <AlertProvider>
          <GameCounter game={game} />
        </AlertProvider>
      </MemoryRouter>
    </ThemeProvider>,
  )

const game: Game = {
  id: 'game-1',
  phase: { id: 'phase-1', name: 'Phase Finale', order: 1, type: 'POOL' },
  time: new Date('2026-05-01T18:30:00Z'),
  court: 'Central',
  status: 'scheduled',
  contestants: new Set([
    { id: 'team-1', name: 'Aigles' },
    { id: 'team-2', name: 'Tigres' },
  ]),
  referee: undefined,
  score: { pointsByTeam: { 'team-1': 2, 'team-2': 5 } },
}

describe('GameCounter', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  beforeEach(() => {
    globalThis.localStorage.clear()
  })

  it('should render contestants and initial scores', async () => {
    renderCounter(game)

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument())
    expect(screen.getByText('Aigles')).toBeInTheDocument()
    expect(screen.getByText('Tigres')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should increment the team score when the plus button is clicked', async () => {
    renderCounter(game)

    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument())

    fireEvent.click(screen.getAllByRole('button', { name: '+' })[0])

    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument())
  })

  it('should switch the order of teams when clicking the switch sides button', async () => {
    renderCounter(game)

    await waitFor(() => expect(screen.getByText('Aigles')).toBeInTheDocument())

    const beforeSwitch = document.body.innerHTML
    expect(beforeSwitch.indexOf('Aigles')).toBeLessThan(beforeSwitch.indexOf('Tigres'))

    fireEvent.click(screen.getByRole('button', { name: /changer de côté/i }))

    const afterSwitch = document.body.innerHTML
    expect(afterSwitch.indexOf('Aigles')).toBeGreaterThan(afterSwitch.indexOf('Tigres'))
  })
})
