import { describe, expect, it, vi } from 'vitest'
import { bulkCreateGames, bulkUpdateGames, deleteGame } from './gamesService'

vi.mock('./apiClient', () => ({
  gamesApi: {
    bulkCreateGames: vi.fn(),
    bulkUpdateGames: vi.fn(),
    deleteGame: vi.fn(),
  },
  scoresApi: {},
}))

import { gamesApi } from './apiClient'

const gamesApiMock = vi.mocked(gamesApi)

describe('gamesService', () => {
  it('should delete a game through the API client', async () => {
    // GIVEN
    gamesApiMock.deleteGame.mockResolvedValueOnce(undefined)

    // WHEN
    await deleteGame('game-1')

    // THEN
    expect(gamesApiMock.deleteGame).toHaveBeenCalledWith({ gameId: 'game-1' })
  })

  it('should send bulk game changes through the generated client', async () => {
    // GIVEN
    const updatedGames = [{ id: 'game-1' }]
    gamesApiMock.bulkUpdateGames.mockResolvedValueOnce(updatedGames as never)

    // WHEN
    const result = await bulkUpdateGames(new Set(['game-1', 'game-2']), {
      court: 'Central',
    })

    // THEN
    expect(gamesApiMock.bulkUpdateGames).toHaveBeenCalledWith({
      bulkUpdateGamesRequest: {
        changes: { court: 'Central' },
        gameIds: new Set(['game-1', 'game-2']),
      },
    })
    expect(result).toBe(updatedGames)
  })

  it('should create pool games through the generated client', async () => {
    // GIVEN
    const createdGames = [{ id: 'game-1' }, { id: 'game-2' }]
    const payload = {
      assignReferees: true,
      breakDurationMinutes: 5,
      court: 'Terrain 1',
      gameDurationMinutes: 15,
      group: 'Poule A',
      phaseId: 'phase-1',
      startTime: new Date('2026-06-20T09:00:00Z'),
      teamIds: new Set(['team-1', 'team-2', 'team-3']),
    }
    gamesApiMock.bulkCreateGames.mockResolvedValueOnce(createdGames as never)

    // WHEN
    const result = await bulkCreateGames(payload)

    // THEN
    expect(gamesApiMock.bulkCreateGames).toHaveBeenCalledWith({
      bulkCreateGamesRequest: payload,
    })
    expect(result).toBe(createdGames)
  })
})
