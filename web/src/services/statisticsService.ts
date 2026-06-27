import { phasesApi, statisticsApi, type ContestantStats } from './apiClient'

export type { ContestantStats }

export const listRankings = async (): Promise<ContestantStats[]> =>
  statisticsApi.listRankings()

export const listPhaseRankings = async (phaseId: string): Promise<ContestantStats[]> =>
  phasesApi.listPhaseRankings({ phaseId })
