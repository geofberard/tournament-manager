import { describe, expect, it, vi } from 'vitest'
import { bulkUpdateGames, deleteGame } from './gamesService'

vi.mock('./apiClient', () => ({
  gamesApi: {
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
})
