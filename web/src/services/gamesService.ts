import type {
  BulkCreateGamesRequest,
  BulkGameChanges,
  CreateGameRequest,
  GameScore,
  UpdateGameRequest,
} from '../generated/api-client'
import { gamesApi, scoresApi, type Game } from './apiClient'

export type { Game }
export type { BulkGameChanges }
export type PoolGamesPayload = BulkCreateGamesRequest
export type GamePayload = {
  contestantIds: Set<string>
  court: string
  phaseId: string
  pointsByTeam: Record<string, number> | null
  refereeId?: string
  time?: Date
}

export const listGames = async (): Promise<Game[]> => gamesApi.listGames()

export const getGameById = async (gameId: string): Promise<Game> => gamesApi.getGameById({ gameId })

export const createGame = async (gamePayload: GamePayload): Promise<Game> => {
  const createGameRequest: CreateGameRequest = {
    contestantIds: gamePayload.contestantIds,
    court: gamePayload.court,
    phaseId: gamePayload.phaseId,
    refereeId: gamePayload.refereeId,
    time: gamePayload.time,
  }

  return gamesApi.createGame({ createGameRequest }) as Promise<Game>
}

export const updateGame = async (gameId: string, gamePayload: GamePayload): Promise<Game> => {
  const updateGameRequest: UpdateGameRequest = {
    contestantIds: gamePayload.contestantIds,
    court: gamePayload.court,
    phaseId: gamePayload.phaseId,
    refereeId: gamePayload.refereeId,
    time: gamePayload.time,
  }

  return gamesApi.updateGame({ gameId, updateGameRequest }) as Promise<Game>
}

export const bulkUpdateGames = async (
  gameIds: Set<string>,
  changes: BulkGameChanges,
): Promise<Game[]> =>
  gamesApi.bulkUpdateGames({
    bulkUpdateGamesRequest: { changes, gameIds },
  }) as Promise<Game[]>

export const bulkCreateGames = async (bulkCreateGamesRequest: PoolGamesPayload): Promise<Game[]> =>
  gamesApi.bulkCreateGames({ bulkCreateGamesRequest }) as Promise<Game[]>

export const deleteGame = async (gameId: string): Promise<void> =>
  gamesApi.deleteGame({ gameId })

export const upsertGameScore = async (
  gameId: string,
  pointsByTeam: Record<string, number>,
): Promise<GameScore> =>
  scoresApi.upsertGameScore({
    gameId,
    upsertGameScoreRequest: { pointsByTeam },
  })

export const deleteGameScore = async (gameId: string): Promise<void> =>
  scoresApi.deleteGameScore({ gameId })
