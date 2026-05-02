import { fetchJson, teamsApi, type Team } from './apiClient'

export type { Team }

export type Pool = {
  id: string
}

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()

export const getTeamPool = async (teamId: string, phaseId: string): Promise<Pool> =>
  fetchJson<Pool>(
    `/api/phases/${encodeURIComponent(phaseId)}/teams/${encodeURIComponent(teamId)}/pool`,
  )
