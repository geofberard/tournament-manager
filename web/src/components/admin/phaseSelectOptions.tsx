import type { ReactNode } from 'react'
import { Box, MenuItem } from '@mui/material'
import type { PhaseNode } from '../../hooks/usePhaseTree'

export const renderPhaseMenuItems = (
  nodes: PhaseNode[],
  excludedBranchId?: string,
  depth = 0,
): ReactNode[] => nodes.flatMap((node) => {
  if (node.phase.id === excludedBranchId) {
    return []
  }

  return [
    <MenuItem key={node.phase.id} sx={{ pl: 2 + depth * 3 }} value={node.phase.id}>
      {depth > 0 ? (
        <Box aria-hidden component="span" sx={{ color: 'text.disabled', mr: 1 }}>
          └
        </Box>
      ) : null}
      {node.phase.name}
    </MenuItem>,
    ...renderPhaseMenuItems(node.subPhases ?? [], excludedBranchId, depth + 1),
  ]
})

export const findPhaseName = (nodes: PhaseNode[], phaseId: string): string | undefined => {
  for (const node of nodes) {
    if (node.phase.id === phaseId) {
      return node.phase.name
    }

    const subPhaseName = findPhaseName(node.subPhases ?? [], phaseId)
    if (subPhaseName) {
      return subPhaseName
    }
  }

  return undefined
}
