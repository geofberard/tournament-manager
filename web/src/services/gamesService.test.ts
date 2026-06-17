import { describe, expect, it, beforeEach, vi } from 'vitest'
import { getGameById, listGames, bulkCreateGames, bulkUpdateGames, deleteGame } from './gamesService'
import type { Game } from './apiClient'

vi.mock('./apiClient', () => ({
  gamesApi: {
    listGames: vi.fn(),
    getGameById: vi.fn(),
    bulkCreateGames: vi.fn(),
    bulkUpdateGames: vi.fn(),
    deleteGame: vi.fn(),
  },
  scoresApi: {},
}))

import { gamesApi } from './apiClient'
const listGamesMock = gamesApi.listGames as ReturnType<typeof vi.fn>
const getGameByIdMock = gamesApi.getGameById as ReturnType<typeof vi.fn>

const gamesApiMock = vi.mocked(gamesApi)

describe('gamesService', () => {
  beforeEach(() => {
    listGamesMock.mockReset()
    getGameByIdMock.mockReset()
  })

  it('should return games from gamesApi.listGames', async () => {
    const games = [
      {
        id: 'game-1',
        phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
        subgroup: undefined,
        group: 'Poule A',
        time: new Date('2026-05-01T18:30:00Z'),
        court: 'Central',
        status: 'scheduled',
        contestants: new Set([{ id: 'team-1', name: 'Aigles' }]),
        referee: undefined,
        score: { pointsByTeam: { 'team-1': 0 } },
      },
    ] as Game[]

    listGamesMock.mockResolvedValueOnce(games)

    const result = await listGames()

    expect(result).toBe(games)
    expect(listGamesMock).toHaveBeenCalledOnce()
  })

  it('should call gamesApi.getGameById with the provided gameId', async () => {
    const game = {
      id: 'game-1',
      phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
      name: undefined,
      group: 'Poule A',
      time: new Date('2026-05-01T18:30:00Z'),
      court: 'Central',
      status: 'scheduled',
      contestants: new Set([{ id: 'team-1', name: 'Aigles' }]),
      referee: undefined,
      score: { pointsByTeam: { 'team-1': 0 } },
    } as Game

    getGameByIdMock.mockResolvedValueOnce(game)

    const result = await getGameById('game-1')

    expect(result).toBe(game)
    expect(getGameByIdMock).toHaveBeenCalledOnce()
    expect(getGameByIdMock).toHaveBeenCalledWith({ gameId: 'game-1' })
  })

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
