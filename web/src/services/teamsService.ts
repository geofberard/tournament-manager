import { fetchJson, teamsApi, type Team } from './apiClient'

export type { Team }

export type Group = {
  id: string
}

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()

export const getTeamGroup = async (teamId: string, phaseId: string): Promise<Group> =>
  fetchJson<Group>(
    `/api/phases/${encodeURIComponent(phaseId)}/teams/${encodeURIComponent(teamId)}/group`,
  )
