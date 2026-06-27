import { phasesApi, type ContestantStats } from './apiClient'

export type { ContestantStats }

export const listPhaseRankings = async (phaseId: string): Promise<ContestantStats[]> =>
  phasesApi.listPhaseRankings({ phaseId })
