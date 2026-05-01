import useSWR from 'swr'
import { listPoolRankings, type ContestantStats } from '../services/statisticsService'
import { getTeamPool, type Pool } from '../services/teamsService'

const poolFetcher = async ([_key, teamId]: readonly [string, string]) => getTeamPool(teamId)
const rankingsFetcher = async ([_key, poolId]: readonly [string, string]) => listPoolRankings(poolId)

export function useRankings(teamId: string) {
  const { data: pool, error: poolError, isLoading: isPoolLoading } = useSWR<Pool>(
    teamId ? ['/api/teams/pool', teamId] : null,
    poolFetcher,
  )
  const { data, error: rankingsError, isLoading: isRankingsLoading } = useSWR<ContestantStats[]>(
    pool?.id ? ['/api/pools/statistics', pool.id] : null,
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
