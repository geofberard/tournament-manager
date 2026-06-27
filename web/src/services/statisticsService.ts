import { phasesApi, type ContestantStats, type PhaseStatistics } from './apiClient'

export type { ContestantStats, PhaseStatistics }

export const listPhaseRankings = async (phaseId: string): Promise<ContestantStats[]> =>
  phasesApi.listPhaseGameStatistics({ phaseId })

export const getPhaseStatistics = async (phaseId: string): Promise<PhaseStatistics> =>
  phasesApi.getPhaseStatistics({ phaseId })
