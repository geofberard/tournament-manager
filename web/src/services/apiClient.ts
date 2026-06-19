import {
  AdminAuthApi,
  Configuration,
  GamesApi,
  PhasesApi,
  ScoresApi,
  StatisticsApi,
  TeamsApi,
  type CreateTeamRequest,
  type CreatePhaseRequest,
  type ContestantStats,
  type Game as ApiGame,
  type Phase as ApiPhase,
  type Team,
  type UpdatePhaseRequest,
  type UpdateTeamRequest,
} from '../generated/api-client'

export type PhaseType = 'POOL' | 'BRACKET'
export type Phase = ApiPhase & { type: PhaseType }
export type Game = Omit<ApiGame, 'phase' | 'position'> & { phase: Phase; position?: number }

const apiConfiguration = new Configuration({
  basePath: '',
  credentials: 'include',
})

const teamsApi = new TeamsApi(apiConfiguration)
const adminAuthApi = new AdminAuthApi(apiConfiguration)
const gamesApi = new GamesApi(apiConfiguration)
const phasesApi = new PhasesApi(apiConfiguration)
const scoresApi = new ScoresApi(apiConfiguration)
const statisticsApi = new StatisticsApi(apiConfiguration)

export { adminAuthApi }
export { teamsApi }
export { gamesApi, phasesApi, scoresApi, statisticsApi }
export type {
  ContestantStats,
  CreatePhaseRequest,
  CreateTeamRequest,
  Team,
  UpdatePhaseRequest,
  UpdateTeamRequest,
}

export const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`La requete API a echoue (${response.status}).`)
  }

  return response.json() as Promise<T>
}
