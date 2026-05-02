import useSWR from 'swr'
import { listPoolRankings, type ContestantStats } from '../services/statisticsService'
import { getTeamPool, type Pool } from '../services/teamsService'

const poolFetcher = async ([_key, phaseId, teamId]: readonly [string, string, string]) =>
  getTeamPool(teamId, phaseId)
const rankingsFetcher = async ([_key, phaseId, poolId]: readonly [string, string, string]) =>
  listPoolRankings(poolId, phaseId)

export function useRankings(teamId: string, phaseId: string | null) {
  const { data: pool, error: poolError, isLoading: isPoolLoading } = useSWR<Pool>(
    teamId && phaseId ? ['/api/phases/team-pool', phaseId, teamId] : null,
    poolFetcher,
  )
  const { data, error: rankingsError, isLoading: isRankingsLoading } = useSWR<ContestantStats[]>(
    pool?.id && phaseId ? ['/api/phases/pools/statistics', phaseId, pool.id] : null,
    rankingsFetcher,
  )
  const error = poolError ?? rankingsError
  const isLoading = isPoolLoading || isRankingsLoading

  return {
    poolName: pool?.id ?? null,
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement du classement a echoue.' : null,
    isLoading,
    rankings: data ?? [],
  }
}
