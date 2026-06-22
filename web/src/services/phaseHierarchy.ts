import type { Phase, PhaseType } from './apiClient'

export const resolvePhaseType = (phases: Phase[], phase: Phase): PhaseType | undefined => {
  const phasesById = new Map(phases.map((candidate) => [candidate.id, candidate]))
  const visitedIds = new Set<string>()
  let currentPhase: Phase | undefined = phase

  while (currentPhase) {
    if (currentPhase.type) {
      return currentPhase.type
    }
    if (!currentPhase.parentId || visitedIds.has(currentPhase.id)) {
      return undefined
    }
    visitedIds.add(currentPhase.id)
    currentPhase = phasesById.get(currentPhase.parentId)
  }

  return undefined
}
