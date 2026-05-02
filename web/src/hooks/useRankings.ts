import useSWR from 'swr'
import { listGroupRankings, type ContestantStats } from '../services/statisticsService'
import { getTeamGroup, type Group } from '../services/teamsService'

const groupFetcher = async ([_key, phaseId, teamId]: readonly [string, string, string]) =>
  getTeamGroup(teamId, phaseId)
const rankingsFetcher = async ([_key, phaseId, groupId]: readonly [string, string, string]) =>
  listGroupRankings(groupId, phaseId)

export function useRankings(teamId: string, phaseId: string | null) {
  const { data: group, error: groupError, isLoading: isGroupLoading } = useSWR<Group>(
    teamId && phaseId ? ['/api/phases/team-group', phaseId, teamId] : null,
    groupFetcher,
  )
  const { data, error: rankingsError, isLoading: isRankingsLoading } = useSWR<ContestantStats[]>(
    group?.id && phaseId ? ['/api/phases/groups/statistics', phaseId, group.id] : null,
    rankingsFetcher,
  )
  const error = groupError ?? rankingsError
  const isLoading = isGroupLoading || isRankingsLoading

  return {
    groupName: group?.id ?? null,
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement du classement a echoue.' : null,
    isLoading,
    rankings: data ?? [],
  }
}
