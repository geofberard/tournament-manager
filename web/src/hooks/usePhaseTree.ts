import { useMemo } from 'react'
import type { Phase } from '../services/phasesService'
import { usePhases } from './usePhases'

export type PhaseNode = {
  phase: Phase
  subPhases: PhaseNode[] | undefined
}

export const buildPhaseTree = (phases: Phase[]): PhaseNode[] => {
  const nodesById = new Map<string, PhaseNode>(
    phases.map((phase) => [phase.id, { phase, subPhases: undefined }]),
  )
  const rootNodes: PhaseNode[] = []

  phases
    .slice()
    .sort((firstPhase, secondPhase) => firstPhase.order - secondPhase.order)
    .forEach((phase) => {
      const node = nodesById.get(phase.id)
      if (!node) {
        return
      }

      const parentNode = phase.parentId ? nodesById.get(phase.parentId) : undefined
      if (parentNode) {
        parentNode.subPhases ??= []
        parentNode.subPhases.push(node)
      } else {
        rootNodes.push(node)
      }
    })

  return rootNodes
}

export const usePhaseTree = () => {
  const phaseState = usePhases()
  const phaseTree = useMemo(() => buildPhaseTree(phaseState.phases), [phaseState.phases])

  return {
    ...phaseState,
    phaseTree,
  }
}
