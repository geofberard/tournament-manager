import { Configuration, TeamsApi, type Team } from '../generated/api-client'

const apiConfiguration = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? window.location.origin,
})

const teamsApi = new TeamsApi(apiConfiguration)

export type { Team }

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()
