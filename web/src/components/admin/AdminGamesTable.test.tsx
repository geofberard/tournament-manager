import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'
import { AdminGamesTable } from './AdminGamesTable'

const game: Game = {
  contestants: new Set([
    { id: 'team-1', name: 'Tigres' },
    { id: 'team-2', name: 'Lynx' },
  ]),
  court: 'Terrain 1',
  group: 'Poule A',
  id: 'game-1',
  name: 'Finale',
  phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
  referee: { id: 'team-3', name: 'Aigles' },
  score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
  status: GameStatus.Completed,
  time: new Date('2026-05-03T10:30:00.000Z'),
}

const renderTable = (
  games: Game[],
  onGameClick = vi.fn(),
  onScoreSave = vi.fn().mockResolvedValue(undefined),
  onSelectionChange = vi.fn(),
  selectedGameIds = new Set<string>(),
  onBulkEdit = vi.fn(),
  onBulkDelete = vi.fn().mockResolvedValue(undefined),
) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <AdminGamesTable
        games={games}
        onBulkDelete={onBulkDelete}
        onBulkEdit={onBulkEdit}
        onGameClick={onGameClick}
        onScoreSave={onScoreSave}
        onSelectionChange={onSelectionChange}
        selectedGameIds={selectedGameIds}
      />
    </ThemeProvider>,
  )

describe('AdminGamesTable', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render games and visible columns', () => {
    // WHEN
    renderTable([game])

    // THEN
    expect(screen.getByRole('columnheader', { name: /Heure/ })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Score/ })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Modifier le score de Tigres' })).toHaveTextContent('21')
    expect(screen.getByRole('button', { name: 'Modifier le score de Lynx' })).toHaveTextContent('18')
    expect(screen.queryByText('Finale')).not.toBeInTheDocument()
  })

  it('should render an empty state', () => {
    // WHEN
    renderTable([])

    // THEN
    expect(screen.getByText('Aucun match disponible.')).toBeInTheDocument()
  })

  it('should render a score when the game is not completed', () => {
    // WHEN
    renderTable([{ ...game, status: GameStatus.Scheduled }])

    // THEN
    expect(screen.getByRole('button', { name: 'Modifier le score de Tigres' })).toHaveTextContent('21')
    expect(screen.getByRole('button', { name: 'Modifier le score de Lynx' })).toHaveTextContent('18')
    expect(screen.queryByText('∅')).not.toBeInTheDocument()
  })

  it('should notify when a game row is clicked', () => {
    // GIVEN
    const onGameClick = vi.fn()
    renderTable([game], onGameClick)

    // WHEN
    fireEvent.click(screen.getByRole('row', { name: /Brassage Poule A Tigres 21 - 18 Lynx/ }))

    // THEN
    expect(onGameClick).toHaveBeenCalledWith(game)
  })

  it('should edit a score without notifying a row click', () => {
    // GIVEN
    const onGameClick = vi.fn()
    renderTable([game], onGameClick)

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres' }))

    // THEN
    expect(screen.getByRole('textbox', { name: 'Score Tigres' })).toBeInTheDocument()
    expect(onGameClick).not.toHaveBeenCalled()
  })

  it('should notify when a game is selected without opening it', () => {
    // GIVEN
    const onGameClick = vi.fn()
    const onSelectionChange = vi.fn()
    renderTable([game], onGameClick, undefined, onSelectionChange)

    // WHEN
    fireEvent.click(screen.getByRole('checkbox', { name: 'Selectionner le match' }))

    // THEN
    expect(onSelectionChange).toHaveBeenCalledWith(new Set(['game-1']))
    expect(onGameClick).not.toHaveBeenCalled()
  })

  it('should display selection actions in the toolbar', () => {
    // GIVEN
    const onBulkEdit = vi.fn()
    const onBulkDelete = vi.fn().mockResolvedValue(undefined)
    renderTable(
      [game],
      undefined,
      undefined,
      undefined,
      new Set(['game-1']),
      onBulkEdit,
      onBulkDelete,
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier les matchs selectionnes' }))

    // THEN
    expect(screen.getByText('1 match selectionne')).toBeInTheDocument()
    expect(onBulkEdit).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
  })
})
