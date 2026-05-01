import { gamesApi, type Game } from './apiClient'

export type { Game }

export const listGames = async (): Promise<Game[]> => gamesApi.listGames()
