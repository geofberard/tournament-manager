import { fetchJson, statisticsApi, type ContestantStats } from './apiClient'

export type { ContestantStats }

export const listRankings = async (): Promise<ContestantStats[]> =>
  statisticsApi.listRankings()

export const listPoolRankings = async (poolId: string, phaseId: string): Promise<ContestantStats[]> =>
  fetchJson<ContestantStats[]>(
    `/api/phases/${encodeURIComponent(phaseId)}/pools/${encodeURIComponent(poolId)}/statistics`,
  )
