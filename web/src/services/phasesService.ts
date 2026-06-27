import {
  fetchJson,
  phasesApi,
  type CreatePhaseRequest,
  type Phase,
  type UpdatePhaseRequest,
} from './apiClient'
import { getApiErrorCode, UserFacingError } from './apiError'

export type { Phase }
export type PhasePayload = CreatePhaseRequest

export const listPhases = async (): Promise<Phase[]> =>
  fetchJson<Phase[]>('/api/phases')

const rethrowPhaseHierarchyError = async (error: unknown): Promise<never> => {
  if (await getApiErrorCode(error) === 'PHASE_HIERARCHY_CYCLE') {
    throw new UserFacingError(
      "Cette phase ne peut pas avoir ce parent, car cela créerait une boucle dans l'arborescence.",
    )
  }

  throw error
}

export const createPhase = async (createPhaseRequest: PhasePayload): Promise<Phase> => {
  try {
    return await phasesApi.createPhase({ createPhaseRequest }) as Phase
  } catch (error) {
    return rethrowPhaseHierarchyError(error)
  }
}

export const updatePhase = async (phaseId: string, updatePhaseRequest: UpdatePhaseRequest): Promise<Phase> => {
  try {
    return await phasesApi.updatePhase({ phaseId, updatePhaseRequest }) as Phase
  } catch (error) {
    return rethrowPhaseHierarchyError(error)
  }
}

export const deletePhase = async (phaseId: string): Promise<void> => {
  try {
    await phasesApi.deletePhase({ phaseId })
  } catch (error) {
    const errorCode = await getApiErrorCode(error)
    if (errorCode === 'PHASE_HAS_CHILDREN') {
      throw new UserFacingError(
        "Cette phase ne peut pas être supprimée car elle contient des sous-phases. Supprimez ou déplacez d'abord ses sous-phases.",
      )
    }

    if (errorCode === 'PHASE_IN_USE') {
      throw new UserFacingError(
        "Cette phase ne peut pas être supprimée car elle est utilisée par un ou plusieurs matchs.",
      )
    }

    throw error
  }
}
