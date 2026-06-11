import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GameStatus } from '../../generated/api-client'
import type { GamePayload } from '../../services/gamesService'
import { ManageGameForm } from './ManageGameForm'

const phases = [{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' as const }]
const teams = [
  { id: 'team-1', name: 'Tigres' },
  { id: 'team-2', name: 'Lynx' },
  { id: 'team-3', name: 'Aigles' },
]
const initialValue: GamePayload = {
  contestantIds: new Set(['team-1', 'team-2']),
  court: 'Terrain 1',
  group: 'Poule A',
  name: 'Match test',
  phaseId: 'phase-1',
  refereeId: 'team-1',
  status: GameStatus.Scheduled,
  time: new Date(2026, 4, 3, 10, 30),
}

const renderForm = (overrides: Partial<GamePayload> = {}, onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  const onClose = vi.fn()

  render(
    <ThemeProvider theme={createTheme()}>
      <ManageGameForm
        initialValue={{ ...initialValue, ...overrides }}
        isUpdate
        onClose={onClose}
        onSubmit={onSubmit}
        phases={phases}
        teams={teams}
        titleLabel="Modifier le match"
      />
    </ThemeProvider>,
  )

  return { onClose, onSubmit }
}

describe('ManageGameForm', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render the provided title and initial values', () => {
    // WHEN
    renderForm()

    // THEN
    expect(screen.getByRole('heading', { name: 'Modifier le match' })).toBeInTheDocument()
    expect(screen.getByDisplayValue('Poule A')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Terrain 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Match test')).toBeInTheDocument()
    expect(screen.getByText('Tigres, Lynx')).toBeInTheDocument()
  })

  it('should submit a trimmed game payload', async () => {
    // GIVEN
    const { onSubmit } = renderForm({
      court: '  Terrain 1  ',
      group: '  Poule A  ',
      name: '  Finale  ',
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...initialValue,
        court: 'Terrain 1',
        group: 'Poule A',
        name: 'Finale',
      }),
    )
  })

  it('should require exactly two contestants', async () => {
    // GIVEN
    const { onSubmit } = renderForm({ contestantIds: new Set(['team-1']) })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    expect(await screen.findByText('Selectionnez exactement deux equipes.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should disable unselected teams when two contestants are selected', () => {
    // GIVEN
    renderForm()

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Equipes' }))

    // THEN
    expect(screen.getByRole('option', { name: 'Tigres' })).toBeEnabled()
    expect(screen.getByRole('option', { name: 'Lynx' })).toBeEnabled()
    expect(screen.getByRole('option', { name: 'Aigles' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('should display the submission error and enable retry', async () => {
    // GIVEN
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error('API indisponible'))
    renderForm({}, onSubmit)

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    expect(await screen.findByText('API indisponible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sauvegarder' })).toBeEnabled()
  })

  it('should close when clicking cancel', () => {
    // GIVEN
    const { onClose } = renderForm()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    // THEN
    expect(onClose).toHaveBeenCalled()
  })
})
