import { describe, expect, it, vi } from 'vitest'
import { deleteGame } from './gamesService'

vi.mock('./apiClient', () => ({
  gamesApi: {
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
})
