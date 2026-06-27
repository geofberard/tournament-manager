import type { ReactNode } from 'react'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { usePhaseTree, type PhaseNode } from '../../hooks/usePhaseTree'
import type { Phase } from '../../services/phasesService'

const renderPhaseMenuItems = (
  nodes: PhaseNode[],
  isPhaseDisabled?: (phase: Phase) => boolean,
  depth = 0,
): ReactNode[] => nodes.flatMap((node) => {
  const disabled = isPhaseDisabled?.(node.phase)
  return [
    <MenuItem
      disabled={disabled}
      key={node.phase.id}
      sx={{ pl: 2 + depth * 3 }}
      value={node.phase.id}
    >
      {depth > 0 ? (
        <Box aria-hidden component="span" sx={{ color: 'text.disabled', mr: 1 }}>
          └
        </Box>
      ) : null}
      {node.phase.name}
    </MenuItem>,
    ...renderPhaseMenuItems(node.subPhases ?? [], isPhaseDisabled, depth + 1),
  ]
})

const findPhase = (nodes: PhaseNode[], phaseId: string): Phase | undefined => {
  for (const node of nodes) {
    if (node.phase.id === phaseId) {
      return node.phase
    }

    const subPhase = findPhase(node.subPhases ?? [], phaseId)
    if (subPhase) {
      return subPhase
    }
  }

  return undefined
}

const findPhaseName = (nodes: PhaseNode[], phaseId: string): string | undefined =>
  findPhase(nodes, phaseId)?.name

type PhaseSelectProps = {
  allowEmpty?: boolean
  disabled?: boolean
  isPhaseDisabled?: (phase: Phase) => boolean
  label?: string
  onChange: (phase?: Phase) => void
  value: string
  condensed?: boolean
  required?: boolean
}

export const PhaseSelect = ({
  allowEmpty = false,
  disabled = false,
  condensed = false,
  required = false,
  isPhaseDisabled,
  label = 'Phase',
  onChange,
  value,
}: PhaseSelectProps) => {
  const { phaseTree } = usePhaseTree()
  const labelId = `phase-select-${label.toLowerCase().replace(/\s+/g, '-')}-label`
  const handleChange = (event: SelectChangeEvent) => {
    onChange(findPhase(phaseTree, event.target.value))
  }
  const renderValue = (phaseId: string) => {
    if (!phaseId && allowEmpty) {
      return ''
    }

    return findPhaseName(phaseTree, phaseId) ?? phaseId
  }

  return (
    <FormControl
      disabled={disabled}
      fullWidth
      required={required}
      size={condensed ? 'small' : 'medium'}
      sx={condensed ? { minWidth: { sm: 220 } } : undefined}
    >
      <InputLabel id={labelId} shrink={allowEmpty || undefined}>{label}</InputLabel>
      <Select
        displayEmpty={allowEmpty}
        label={label}
        labelId={labelId}
        onChange={handleChange}
        renderValue={renderValue}
        value={value}
      >
        {allowEmpty ? <MenuItem value="">-- Aucune --</MenuItem> : null}
        {renderPhaseMenuItems(phaseTree, isPhaseDisabled)}
      </Select>
    </FormControl>
  )
}
