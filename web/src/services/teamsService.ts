import {
  teamsApi,
  type CreateTeamRequest,
  type Team,
  type UpdateTeamRequest,
} from './apiClient'
import { getApiErrorCode, UserFacingError } from './apiError'

export type { Team }
export type TeamPayload = CreateTeamRequest

export const listTeams = async (): Promise<Team[]> => teamsApi.listTeams()

export const createTeam = async (createTeamRequest: TeamPayload): Promise<Team> =>
  teamsApi.createTeam({ createTeamRequest })

export const updateTeam = async (teamId: string, updateTeamRequest: UpdateTeamRequest): Promise<Team> =>
  teamsApi.updateTeam({ teamId, updateTeamRequest })

export const deleteTeam = async (teamId: string): Promise<void> => {
  try {
    await teamsApi.deleteTeam({ teamId })
  } catch (error) {
    if (await getApiErrorCode(error) === 'TEAM_IN_USE') {
      throw new UserFacingError(
        "Cette équipe ne peut pas être supprimée car elle participe à un ou plusieurs matchs.",
      )
    }

    throw error
  }
}
