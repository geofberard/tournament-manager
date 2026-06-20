import useSWR from 'swr'
import { listGroupRankings, type ContestantStats } from '../services/statisticsService'
import { listPhaseGroups } from '../services/phasesService'
import { type Group } from '../services/teamsService'

const phaseGroupsFetcher = async ([, phaseId]: readonly [string, string]) =>
  listPhaseGroups(phaseId)

export function usePhaseGroups(phaseId: string | null) {
  const { data, error, isLoading } = useSWR<Group[]>(
    phaseId ? ['/api/phases/groups', phaseId] : null,
    phaseGroupsFetcher,
  )

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des groupes a echoue.' : null,
    isLoading,
    groups: data ?? [],
  }
}

const groupRankingsFetcher = async ([, phaseId, groupId]: readonly [string, string, string]) =>
  listGroupRankings(groupId, phaseId)

export function useGroupRankings(groupId: string, phaseId: string | null) {
  const { data, error, isLoading } = useSWR<ContestantStats[]>(
    groupId && phaseId ? ['/api/phases/groups/statistics', phaseId, groupId] : null,
    groupRankingsFetcher,
  )

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des resultats a echoue.' : null,
    isLoading,
    rankings: data ?? [],
  }
}
