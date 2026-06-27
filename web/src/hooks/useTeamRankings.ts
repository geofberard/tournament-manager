import useSWR from 'swr'
import { listPhaseRankings, type ContestantStats } from '../services/statisticsService'

const rankingsFetcher = async ([, phaseId]: readonly [string, string]) =>
  listPhaseRankings(phaseId)

export function useTeamRankings(_teamId: string, phaseId: string | null) {
  const { data, error: rankingsError, isLoading: isRankingsLoading } = useSWR<ContestantStats[]>(
    phaseId ? ['/api/phases/games/statistics', phaseId] : null,
    rankingsFetcher,
  )

  return {
    errorMessage: rankingsError instanceof Error ? rankingsError.message : rankingsError ? 'Le chargement des resultats a echoue.' : null,
    isLoading: isRankingsLoading,
    rankings: data ?? [],
  }
}
