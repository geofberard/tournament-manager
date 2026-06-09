import {
  fetchJson,
  phasesApi,
  type CreatePhaseRequest,
  type Phase,
  type UpdatePhaseRequest,
} from './apiClient'

export type { Phase }
export type PhasePayload = CreatePhaseRequest

export const listPhases = async (): Promise<Phase[]> =>
  fetchJson<Phase[]>('/api/phases')

export const createPhase = async (createPhaseRequest: PhasePayload): Promise<Phase> =>
  phasesApi.createPhase({ createPhaseRequest }) as Promise<Phase>

export const updatePhase = async (phaseId: string, updatePhaseRequest: UpdatePhaseRequest): Promise<Phase> =>
  phasesApi.updatePhase({ phaseId, updatePhaseRequest }) as Promise<Phase>
