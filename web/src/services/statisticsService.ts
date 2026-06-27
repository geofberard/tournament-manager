import { phasesApi, type ContestantStats, type PhaseStatistics as ApiPhaseStatistics, type Team } from './apiClient'

export type PhaseStatistics = Omit<ApiPhaseStatistics, 'teams' | 'teamStats'> & {
  teams: Team[]
  teamStats: ContestantStats[]
}

export type { ContestantStats }

export const getPhaseStatistics = async (phaseId: string): Promise<PhaseStatistics> =>
  phasesApi.getPhaseStatistics({ phaseId }) as Promise<PhaseStatistics>

export const listPhasesStatistics = async (phaseIds: string[]): Promise<PhaseStatistics[]> =>
  Promise.all(phaseIds.map((phaseId) => getPhaseStatistics(phaseId)))
