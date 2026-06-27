import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { GamePayload } from '../../services/gamesService'
import { ManageGameForm } from './ManageGameForm'
import { buildPhaseTree, usePhaseTree } from '../../hooks/usePhaseTree'

vi.mock('../../hooks/usePhaseTree', async () => {
  const actual = await vi.importActual<typeof import('../../hooks/usePhaseTree')>('../../hooks/usePhaseTree')
  return { ...actual, usePhaseTree: vi.fn() }
})

const phases = [
  { id: 'phase-root', name: 'Poules', order: 1 },
  { id: 'phase-1', parentId: 'phase-root', name: 'Brassage', order: 1, type: 'POOL' as const },
]
const teams = [
  { id: 'team-1', name: 'Tigres' },
  { id: 'team-2', name: 'Lynx' },
  { id: 'team-3', name: 'Aigles' },
]
const initialValue: GamePayload = {
  contestantIds: new Set(['team-1', 'team-2']),
  court: 'Terrain 1',
  phaseId: 'phase-1',
  pointsByTeam: {
    'team-1': 21,
    'team-2': 18,
  },
  refereeId: 'team-1',
  time: new Date(2026, 4, 3, 10, 30),
}

const renderForm = (overrides: Partial<GamePayload> = {}, onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  const onClose = vi.fn()
  vi.mocked(usePhaseTree).mockReturnValue({
    errorMessage: null,
    isLoading: false,
    phases,
    phaseTree: buildPhaseTree(phases),
  })

  render(
    <ThemeProvider theme={createTheme()}>
      <ManageGameForm
        initialValue={{ ...initialValue, ...overrides }}
        isUpdate
        onClose={onClose}
        onSubmit={onSubmit}
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
    expect(screen.getByDisplayValue('Terrain 1')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Equipe 1' })).toHaveTextContent('Tigres')
    expect(screen.getByRole('combobox', { name: 'Equipe 2' })).toHaveTextContent('Lynx')
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 1' })).toHaveValue(21)
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 2' })).toHaveValue(18)
  })

  it('should display phase choices in hierarchy order', () => {
    renderForm()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase' }))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['Poules', '└Brassage'])
    expect(screen.getByRole('option', { name: 'Brassage' })).toBeInTheDocument()
  })

  it('should submit a trimmed game payload', async () => {
    // GIVEN
    const { onSubmit } = renderForm({
      court: '  Terrain 1  ',
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...initialValue,
        court: 'Terrain 1',
      }),
    )
  })

  it('should require exactly two contestants', async () => {
    // GIVEN
    const { onSubmit } = renderForm({ contestantIds: new Set(['team-1']) })

    // WHEN
    fireEvent.submit(screen.getByRole('button', { name: 'Sauvegarder' }).closest('form')!)

    // THEN
    expect(await screen.findByText('Selectionnez exactement deux equipes.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should disable the other selected team in each team selector', () => {
    // GIVEN
    renderForm()

    // WHEN
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Equipe 1' }))

    // THEN
    expect(screen.getByRole('option', { name: 'Tigres' })).toBeEnabled()
    expect(screen.getByRole('option', { name: 'Lynx' })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('option', { name: 'Aigles' })).toBeEnabled()
  })

  it('should clear the previous team score when changing a contestant', () => {
    // GIVEN
    renderForm()
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Equipe 1' }))

    // WHEN
    fireEvent.click(screen.getByRole('option', { name: 'Aigles' }))

    // THEN
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 1' })).toHaveValue(null)
    expect(screen.getByRole('spinbutton', { name: 'Score Equipe 2' })).toHaveValue(18)
  })

  it('should require both scores when one score is provided', async () => {
    // GIVEN
    const { onSubmit } = renderForm({ pointsByTeam: null })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 1' }), {
      target: { value: '12' },
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    expect(
      await screen.findByText('Renseignez le score des deux equipes ou laissez les deux scores vides.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit scores linked to selected teams', async () => {
    // GIVEN
    const { onSubmit } = renderForm({ pointsByTeam: null })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 1' }), {
      target: { value: '12' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 2' }), {
      target: { value: '9' },
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...initialValue,
        pointsByTeam: {
          'team-1': 12,
          'team-2': 9,
        },
      }),
    )
  })

  it('should submit an empty score when both score fields are cleared', async () => {
    // GIVEN
    const { onSubmit } = renderForm()
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 1' }), {
      target: { value: '' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Score Equipe 2' }), {
      target: { value: '' },
    })

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Sauvegarder' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...initialValue,
        pointsByTeam: null,
      }),
    )
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
