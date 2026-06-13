import type { CreateGameRequest, GameScore, UpdateGameRequest } from '../generated/api-client'
import { gamesApi, scoresApi, type Game } from './apiClient'

export type { Game }
export type GamePayload = {
  contestantIds: Set<string>
  court: string
  group: string
  name?: string
  phaseId: string
  pointsByTeam: Record<string, number> | null
  refereeId?: string
  status: UpdateGameRequest['status']
  time: Date
}

export const listGames = async (): Promise<Game[]> => gamesApi.listGames()

export const createGame = async (gamePayload: GamePayload): Promise<Game> => {
  const createGameRequest: CreateGameRequest = {
    contestantIds: gamePayload.contestantIds,
    court: gamePayload.court,
    group: gamePayload.group,
    name: gamePayload.name,
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
    group: gamePayload.group,
    name: gamePayload.name,
    phaseId: gamePayload.phaseId,
    refereeId: gamePayload.refereeId,
    status: gamePayload.status,
    time: gamePayload.time,
  }

  return gamesApi.updateGame({ gameId, updateGameRequest }) as Promise<Game>
}

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
