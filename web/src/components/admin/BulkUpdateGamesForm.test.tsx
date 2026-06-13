import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BulkUpdateGamesForm } from './BulkUpdateGamesForm'

const renderForm = (onSubmit = vi.fn().mockResolvedValue(undefined)) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <BulkUpdateGamesForm
        gameCount={2}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        phases={[{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }]}
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

  it('should explicitly clear an enabled optional value left empty', async () => {
    // GIVEN
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    renderForm(onSubmit)

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: 'Modifier le nom' }))
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs' }))

    // THEN
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ clearName: true }))
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
