import useSWR from 'swr'
import { listPhaseRankings, type ContestantStats } from '../services/statisticsService'

const phaseRankingsFetcher = async ([, phaseId]: readonly [string, string]) =>
  listPhaseRankings(phaseId)

export function usePhaseRankings(phaseId: string | null) {
  const { data, error, isLoading } = useSWR<ContestantStats[]>(
    phaseId ? ['/api/phases/statistics', phaseId] : null,
    phaseRankingsFetcher,
  )

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des resultats a echoue.' : null,
    isLoading,
    rankings: data ?? [],
  }
}
