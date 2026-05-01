import { statisticsApi, type ContestantStats } from './apiClient'

export type { ContestantStats }

export const listRankings = async (): Promise<ContestantStats[]> =>
  statisticsApi.listRankings()
