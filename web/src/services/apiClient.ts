import {
  Configuration,
  GamesApi,
  StatisticsApi,
  TeamsApi,
  type ContestantStats,
  type Game,
  type Team,
} from '../generated/api-client'

const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? window.location.origin,
})

const teamsApi = new TeamsApi(apiConfiguration)
const gamesApi = new GamesApi(apiConfiguration)
const statisticsApi = new StatisticsApi(apiConfiguration)

export { teamsApi }
export { gamesApi, statisticsApi }
export type { ContestantStats, Game, Team }
