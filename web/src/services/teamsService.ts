import { teamsApi, type Team } from './apiClient'

export type { Team }

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()
