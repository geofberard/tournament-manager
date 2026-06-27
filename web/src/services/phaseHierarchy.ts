import type { Phase, PhaseType } from './apiClient'

export const getRootPhases = (phases: Phase[]): Phase[] =>
  phases
    .filter((phase) => !phase.parentId)
    .slice()
    .sort((firstPhase, secondPhase) => firstPhase.order - secondPhase.order)

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

export const getPoolPhasesInBranch = (phases: Phase[], rootPhase: Phase): Phase[] => {
  const childrenByParentId = new Map<string, Phase[]>()

  phases.forEach((phase) => {
    if (!phase.parentId) {
      return
    }

    const siblings = childrenByParentId.get(phase.parentId) ?? []
    siblings.push(phase)
    childrenByParentId.set(phase.parentId, siblings)
  })

  childrenByParentId.forEach((children) => {
    children.sort((firstPhase, secondPhase) => firstPhase.order - secondPhase.order)
  })

  const poolPhases: Phase[] = []
  const visitedIds = new Set<string>()
  const visit = (phase: Phase) => {
    if (visitedIds.has(phase.id)) {
      return
    }

    visitedIds.add(phase.id)
    if (resolvePhaseType(phases, phase) === 'POOL') {
      poolPhases.push({ ...phase, type: 'POOL' })
    }

    childrenByParentId.get(phase.id)?.forEach(visit)
  }

  visit(rootPhase)

  return poolPhases
}
