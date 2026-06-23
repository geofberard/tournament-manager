import { useState } from 'react'
import Edit from '@mui/icons-material/Edit'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import type { Phase } from '../../services/phasesService'
import { DeleteButton } from './DeleteButton'

type PhaseTreeItemProps = {
  node: PhaseNode
  onDelete: (phase: Phase) => Promise<void> | void
  onEdit: (phase: Phase) => void
}

export const PhaseTreeItem = ({ node, onDelete, onEdit }: PhaseTreeItemProps) => {
  const [open, setOpen] = useState(true)
  const hasSubPhases = Boolean(node.subPhases?.length)

  return (
    <>
      <ListItem
        component="div"
        sx={{ py: 0.75 }}
      >
        <ListItemText primary={node.phase.name} />
        <Stack alignItems="center" direction="row" spacing={0.5}>
          {hasSubPhases ? (
            <IconButton
              aria-label={`${open ? 'Réduire' : 'Développer'} ${node.phase.name}`}
              onClick={() => setOpen((currentOpen) => !currentOpen)}
              size="small"
            >
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : null}
          <IconButton aria-label={`Editer ${node.phase.name}`} onClick={() => onEdit(node.phase)} size="small">
            <Edit fontSize="small" />
          </IconButton>
          <DeleteButton
            ariaLabel={`Supprimer ${node.phase.name}`}
            onConfirm={() => onDelete(node.phase)}
          />
        </Stack>
      </ListItem>

      {hasSubPhases ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {node.subPhases?.map((subPhase) => (
              <PhaseTreeItem
                key={subPhase.phase.id}
                node={subPhase}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </List>
        </Collapse>
      ) : null}
    </>
  )
}
