import {
  AdminAuthApi,
  Configuration,
  GamesApi,
  StatisticsApi,
  TeamsApi,
  type ContestantStats,
  type Game as ApiGame,
  type Phase as ApiPhase,
  type Team,
} from '../generated/api-client'

export type PhaseType = 'POOL' | 'BRACKET'
export type Phase = ApiPhase & { type: PhaseType }
export type Game = Omit<ApiGame, 'phase'> & { phase: Phase }

const apiBasePath = import.meta.env.VITE_API_BASE_URL ?? window.location.origin

const apiConfiguration = new Configuration({
  basePath: apiBasePath,
  credentials: 'include',
})

const teamsApi = new TeamsApi(apiConfiguration)
const adminAuthApi = new AdminAuthApi(apiConfiguration)
const gamesApi = new GamesApi(apiConfiguration)
const statisticsApi = new StatisticsApi(apiConfiguration)

export { adminAuthApi }
export { teamsApi }
export { gamesApi, statisticsApi }
export type { ContestantStats, Team }

export const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${apiBasePath}${path}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`La requete API a echoue (${response.status}).`)
  }

  return response.json() as Promise<T>
}
