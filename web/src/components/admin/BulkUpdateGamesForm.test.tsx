import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BulkUpdateGamesForm } from './BulkUpdateGamesForm'
import { buildPhaseTree } from '../../hooks/usePhaseTree'

const phases = [
  { id: 'phase-root', name: 'Poules', order: 1 },
  { id: 'phase-1', parentId: 'phase-root', name: 'Brassage', order: 1, type: 'POOL' as const },
]

const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined)) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <BulkUpdateGamesForm
        gameCount={2}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        phaseTree={buildPhaseTree(phases)}
        teams={[
          { id: 'team-1', name: 'Tigres' },
          { id: 'team-2', name: 'Lynx' },
        ]}
      />
    </ThemeProvider>,
  )

describe('BulkUpdateGamesForm', () => {
  afterEach(cleanup)

  it('should disable submission until a field is selected', () => {
    // WHEN
    renderForm()

    // THEN
    expect(screen.getByRole('button', { name: 'Modifier les matchs' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Terrain' })).toBeDisabled()
  })

  it('should display phase choices in hierarchy order', () => {
    renderForm()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Modifier la phase' }))

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Phase' }))

    const options = screen.getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['Poules', '└Brassage'])
    expect(screen.getByRole('option', { name: 'Brassage' })).toBeInTheDocument()
  })

  it('should submit only enabled fields', async () => {
    // GIVEN
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: 'Modifier le terrain' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: ' Central ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ court: 'Central' }))
  })

  it.each([
    ['retard', '20', 20],
    ['avance', '-10', -10],
  ])('should submit a %s in minutes', async (_label, inputValue, expectedOffset) => {
    // GIVEN
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: "Décaler l'heure" }))
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Decalage en minutes' }), {
      target: { value: inputValue },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ timeOffsetMinutes: expectedOffset }),
    )
  })

  it('should make the date replacement and time offset mutually exclusive', () => {
    // GIVEN
    renderForm()
    const replaceTimeCheckbox = screen.getByRole('checkbox', {
      name: 'Modifier la date et heure',
    })
    const offsetTimeCheckbox = screen.getByRole('checkbox', {
      name: "Décaler l'heure",
    })

    // WHEN
    fireEvent.click(replaceTimeCheckbox)
    fireEvent.click(offsetTimeCheckbox)

    // THEN
    expect(replaceTimeCheckbox).not.toBeChecked()
    expect(offsetTimeCheckbox).toBeChecked()
  })

  it('should submit a request to clear planned times', async () => {
    // GIVEN
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: "Effacer l'heure" }))
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ clearTime: true }))
  })

  it('should require a non-zero integer time offset', () => {
    // GIVEN
    renderForm()
    fireEvent.click(screen.getByRole('checkbox', { name: "Décaler l'heure" }))
    const offsetInput = screen.getByRole('spinbutton', { name: 'Decalage en minutes' })
    const submitButton = screen.getByRole('button', { name: 'Modifier les matchs' })

    // WHEN / THEN
    expect(submitButton).toBeDisabled()
    expect(screen.getByText('Saisissez un nombre entier different de zero.')).toBeInTheDocument()

    fireEvent.change(offsetInput, { target: { value: '1.5' } })
    expect(submitButton).toBeDisabled()

    fireEvent.change(offsetInput, { target: { value: '0' } })
    expect(submitButton).toBeDisabled()

    fireEvent.change(offsetInput, { target: { value: '-1' } })
    expect(submitButton).toBeEnabled()
  })

  it('should display an API error and keep the form open', async () => {
    // GIVEN
    renderForm(vi.fn().mockRejectedValue(new Error('Modification impossible')))

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: 'Modifier le terrain' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Terrain' }), {
      target: { value: 'Central' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    expect(await screen.findByText('Modification impossible')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Modifier 2 matchs' })).toBeInTheDocument()
  })
})
