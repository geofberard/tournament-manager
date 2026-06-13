import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'
import { EditableGameScore } from './EditableGameScore'

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

describe('EditableGameScore', () => {
  afterEach(() => {
    cleanup()
  })

  it('should edit and save the score', async () => {
    // GIVEN
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<EditableGameScore game={game} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres' }))

    // WHEN
    fireEvent.change(screen.getByRole('textbox', { name: 'Score Tigres' }), { target: { value: '25' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Score Lynx' }), { target: { value: '20' } })
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Score Lynx' }), { key: 'Enter' })

    // THEN
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        'team-1': 25,
        'team-2': 20,
      })
    })
    expect(screen.getByRole('button', { name: 'Modifier le score de Tigres' })).toBeInTheDocument()
  })

  it('should focus and select the clicked team score', () => {
    // GIVEN
    const onSave = vi.fn()
    render(<EditableGameScore game={game} onSave={onSave} />)

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Lynx' }))

    // THEN
    const team2Score = screen.getByRole('textbox', { name: 'Score Lynx' })
    expect(team2Score).toHaveFocus()
    expect((team2Score as HTMLInputElement).selectionStart).toBe(0)
    expect((team2Score as HTMLInputElement).selectionEnd).toBe(2)
  })

  it('should cancel score edition with Escape', () => {
    // GIVEN
    const onSave = vi.fn()
    render(<EditableGameScore game={game} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres' }))
    const team1Score = screen.getByRole('textbox', { name: 'Score Tigres' })
    fireEvent.change(team1Score, { target: { value: '30' } })

    // WHEN
    fireEvent.keyDown(team1Score, { key: 'Escape' })

    // THEN
    expect(screen.getByRole('button', { name: 'Modifier le score de Tigres' })).toHaveTextContent('21')
    expect(screen.getByRole('button', { name: 'Modifier le score de Lynx' })).toHaveTextContent('18')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should reject an incomplete score', () => {
    // GIVEN
    const onSave = vi.fn()
    render(
      <EditableGameScore
        game={{ ...game, score: { pointsByTeam: {} }, status: GameStatus.Scheduled }}
        onSave={onSave}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres contre Lynx' }))

    // WHEN
    fireEvent.change(screen.getByRole('textbox', { name: 'Score Tigres' }), { target: { value: '12' } })
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Score Tigres' }), { key: 'Enter' })

    // THEN
    expect(screen.getByRole('alert')).toHaveTextContent("Impossible d'enregistrer ce score.")
    expect(onSave).not.toHaveBeenCalled()
  })

  it('should display and edit a score when the game is not completed', () => {
    // GIVEN
    const onSave = vi.fn()
    render(
      <EditableGameScore
        game={{ ...game, status: GameStatus.Scheduled }}
        onSave={onSave}
      />,
    )

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres' }))

    // THEN
    expect(screen.getByRole('textbox', { name: 'Score Tigres' })).toHaveValue('21')
    expect(screen.getByRole('textbox', { name: 'Score Lynx' })).toHaveValue('18')
  })

  it('should keep the editor open when saving fails', async () => {
    // GIVEN
    const onSave = vi.fn().mockRejectedValue(new Error('Boom'))
    render(<EditableGameScore game={game} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le score de Tigres' }))

    // WHEN
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Score Tigres' }), { key: 'Enter' })

    // THEN
    expect(await screen.findByRole('alert')).toHaveTextContent("Impossible d'enregistrer ce score.")
    expect(screen.getByRole('textbox', { name: 'Score Tigres' })).toBeInTheDocument()
  })
})
