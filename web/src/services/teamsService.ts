import {
  fetchJson,
  teamsApi,
  type CreateTeamRequest,
  type Team,
  type UpdateTeamRequest,
} from './apiClient'

export type { Team }
export type TeamPayload = CreateTeamRequest

export type Group = {
  id: string
}

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()

export const createTeam = async (createTeamRequest: TeamPayload): Promise<Team> =>
  teamsApi.createTeam({ createTeamRequest })

export const updateTeam = async (teamId: string, updateTeamRequest: UpdateTeamRequest): Promise<Team> =>
  teamsApi.updateTeam({ teamId, updateTeamRequest })

export const deleteTeam = async (teamId: string): Promise<void> =>
  teamsApi.deleteTeam({ teamId })

export const getTeamGroup = async (teamId: string, phaseId: string): Promise<Group> =>
  fetchJson<Group>(
    `/api/phases/${encodeURIComponent(phaseId)}/teams/${encodeURIComponent(teamId)}/group`,
  )
