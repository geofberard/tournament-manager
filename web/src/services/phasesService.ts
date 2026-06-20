import {
  fetchJson,
  phasesApi,
  type CreatePhaseRequest,
  type Phase,
  type UpdatePhaseRequest,
} from './apiClient'
import { type Group } from '../services/teamsService'
import { getApiErrorCode, UserFacingError } from './apiError'

export type { Phase }
export type PhasePayload = CreatePhaseRequest

export const listPhases = async (): Promise<Phase[]> =>
  fetchJson<Phase[]>('/api/phases')

export const createPhase = async (createPhaseRequest: PhasePayload): Promise<Phase> =>
  phasesApi.createPhase({ createPhaseRequest }) as Promise<Phase>

export const updatePhase = async (phaseId: string, updatePhaseRequest: UpdatePhaseRequest): Promise<Phase> =>
  phasesApi.updatePhase({ phaseId, updatePhaseRequest }) as Promise<Phase>

export const deletePhase = async (phaseId: string): Promise<void> => {
  try {
    await phasesApi.deletePhase({ phaseId })
  } catch (error) {
    if (await getApiErrorCode(error) === 'PHASE_IN_USE') {
      throw new UserFacingError(
        "Cette phase ne peut pas être supprimée car elle est utilisée par un ou plusieurs matchs.",
      )
    }

    throw error
  }
}

export const listPhaseGroups = async (phaseId: string): Promise<Group[]> =>
  fetchJson<Group[]>(
    `/api/phases/${encodeURIComponent(phaseId)}/groups`,
  )
