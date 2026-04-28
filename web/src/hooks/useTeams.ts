import useSWR from 'swr'
import { listTeams, type Team } from '../services/teamsService'

const TEAMS_KEY = '/api/teams'

const sortTeamsByName = (teams: Team[]) =>
  [...teams].sort((teamA, teamB) => teamA.name.localeCompare(teamB.name, 'fr'))

const loadTeams = async () => sortTeamsByName(await listTeams())

export function useTeams() {
  const { data, error, isLoading } = useSWR<Team[]>(TEAMS_KEY, loadTeams)

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des equipes a echoue.' : null,
    isLoading,
    teams: data ?? [],
  }
}
