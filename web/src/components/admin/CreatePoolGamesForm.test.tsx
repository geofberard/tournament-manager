import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PoolGamesPayload } from '../../services/gamesService'
import { CreatePoolGamesForm } from './CreatePoolGamesForm'

const phases = [
  { id: 'phase-pool', name: 'Brassage', order: 1, type: 'POOL' as const },
  { id: 'phase-bracket', name: 'Finales', order: 2, type: 'BRACKET' as const },
]
const teams = [
  { id: 'team-1', name: 'Tigres' },
  { id: 'team-2', name: 'Lynx' },
  { id: 'team-3', name: 'Aigles' },
]
const initialValue: PoolGamesPayload = {
  assignReferees: false,
  breakDurationMinutes: 5,
  court: '',
  gameDurationMinutes: 15,
  group: '',
  phaseId: 'phase-pool',
  startTime: new Date(2026, 5, 20, 9, 0),
  teamIds: new Set(),
}

const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  const onClose = vi.fn()
  render(
    <ThemeProvider theme={createTheme()}>
      <CreatePoolGamesForm
        initialValue={initialValue}
        onClose={onClose}
        onSubmit={onSubmit}
        phases={phases}
        teams={teams}
      />
    </ThemeProvider>,
  )
  return { onClose, onSubmit }
}

describe('CreatePoolGamesForm', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should only list pool phases', () => {
    // GIVEN
    renderForm()

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase' }))

    // THEN
    expect(screen.getByRole('option', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Finales' })).not.toBeInTheDocument()
  })

  it('should enable creation after selecting two teams', () => {
    // GIVEN
    renderForm()
    const submitButton = screen.getByRole('button', { name: 'Creer les matchs' })

    // WHEN / THEN
    expect(submitButton).toBeDisabled()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tigres' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Lynx' }))
    expect(submitButton).toBeEnabled()
    expect(
      screen.getByRole('checkbox', { name: 'Attribuer un arbitre parmi les equipes restantes' }),
    ).toBeDisabled()
  })

  it('should submit trimmed values and selected teams', async () => {
    // GIVEN
    const { onSubmit } = renderForm()
    fireEvent.change(screen.getByRole('textbox', { name: 'Poule' }), {
      target: { value: '  Poule A  ' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: '  Terrain 1  ' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tigres' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Lynx' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Aigles' }))
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Attribuer un arbitre parmi les equipes restantes' }),
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Creer les matchs' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...initialValue,
        assignReferees: true,
        court: 'Terrain 1',
        group: 'Poule A',
        teamIds: new Set(['team-1', 'team-2', 'team-3']),
      }),
    )
  })

  it('should display an API error and enable retry', async () => {
    // GIVEN
    renderForm(vi.fn().mockRejectedValue(new Error('Creation impossible')))
    fireEvent.change(screen.getByRole('textbox', { name: 'Poule' }), {
      target: { value: 'Poule A' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: 'Terrain 1' },
    })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tigres' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Lynx' }))

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Creer les matchs' }))

    // THEN
    expect(await screen.findByText('Creation impossible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Creer les matchs' })).toBeEnabled()
  })
})
