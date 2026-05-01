import { fetchJson, statisticsApi, type ContestantStats } from './apiClient'

export type { ContestantStats }

export const listRankings = async (): Promise<ContestantStats[]> =>
  statisticsApi.listRankings()

export const listPoolRankings = async (poolId: string): Promise<ContestantStats[]> =>
  fetchJson<ContestantStats[]>(`/api/pools/${encodeURIComponent(poolId)}/statistics`)
