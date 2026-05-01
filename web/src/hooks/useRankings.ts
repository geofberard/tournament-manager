import useSWR from 'swr'
import { listRankings, type ContestantStats } from '../services/statisticsService'

const RANKINGS_KEY = '/api/statistics'

export function useRankings() {
  const { data, error, isLoading } = useSWR<ContestantStats[]>(
    RANKINGS_KEY,
    listRankings,
  )

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement du classement a echoue.' : null,
    isLoading,
    rankings: data ?? [],
  }
}
