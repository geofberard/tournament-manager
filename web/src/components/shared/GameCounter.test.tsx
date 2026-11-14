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

  it('should render the fullscreen mode button', async () => {
    renderCounter(game)

    expect(screen.getByRole('button', { name: /mode plein écran/i })).toBeInTheDocument()
  })

  it('should switch to fullscreen scoreboard mode and return on close', async () => {
    renderCounter(game)

    expect(screen.queryByTestId('fullscreen-scoreboard')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /mode plein écran/i }))

    expect(screen.getByTestId('fullscreen-scoreboard')).toBeInTheDocument()
    expect(screen.getByTestId('score-team-1')).toHaveTextContent('2')
    expect(screen.getByTestId('score-team-2')).toHaveTextContent('5')

    fireEvent.click(screen.getByRole('button', { name: /quitter le mode plein écran/i }))

    expect(screen.queryByTestId('fullscreen-scoreboard')).not.toBeInTheDocument()
  })

  it('should update the score when tapping a team block in fullscreen mode', async () => {
    renderCounter(game)

    fireEvent.click(screen.getByRole('button', { name: /mode plein écran/i }))
    fireEvent.click(screen.getByRole('button', { name: /ajouter un point à aigles/i }))

    await waitFor(() => expect(screen.getByTestId('score-team-1')).toHaveTextContent('3'))
    expect(screen.getByTestId('last-point-team-1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /retirer un point à tigres/i }))

    await waitFor(() => expect(screen.getByTestId('score-team-2')).toHaveTextContent('4'))
  })

  it('should switch sides from the fullscreen scoreboard', async () => {
    renderCounter(game)

    fireEvent.click(screen.getByRole('button', { name: /mode plein écran/i }))

    const blockOrder = () =>
      screen.getAllByTestId(/^scoreboard-block-/).map((block) => block.dataset.testid)

    expect(blockOrder()).toEqual(['scoreboard-block-team-1', 'scoreboard-block-team-2'])

    fireEvent.click(screen.getByRole('button', { name: /changer de côté/i }))

    await waitFor(() =>
      expect(blockOrder()).toEqual(['scoreboard-block-team-2', 'scoreboard-block-team-1']),
    )
  })

  it('should close the fullscreen scoreboard when native fullscreen is exited', async () => {
    renderCounter(game)

    fireEvent.click(screen.getByRole('button', { name: /mode plein écran/i }))
    expect(screen.getByTestId('fullscreen-scoreboard')).toBeInTheDocument()

    fireEvent(document, new Event('fullscreenchange'))

    await waitFor(() => expect(screen.queryByTestId('fullscreen-scoreboard')).not.toBeInTheDocument())
  })
})
