import { useState } from 'react'
import type { MouseEvent } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import type { PhaseType } from '../../services/apiClient'
import type { Phase } from '../../services/phasesService'
import { DeleteButton } from './DeleteButton'
import { PhaseTreeItem } from './PhaseTreeItem'
import { MarkdownContent } from '../shared/MarkdownContent'

const phaseTypeLabels: Record<PhaseType, string> = {
  BRACKET: 'Elimination',
  POOL: 'Poules',
}

type PhaseTreeRootProps = {
  nodes: PhaseNode[]
  onDelete: (phase: Phase) => Promise<void> | void
  onEdit: (phase: Phase) => void
}

export const PhaseTreeRoot = ({ nodes, onDelete, onEdit }: PhaseTreeRootProps) => {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | false>(false)

  const handleEdit = (event: MouseEvent<HTMLButtonElement>, phase: Phase) => {
    event.stopPropagation()
    onEdit(phase)
  }

  return (
    <Stack spacing={0}>
      {nodes.map((node) => {
        const phaseTypeLabel = node.phase.type ? phaseTypeLabels[node.phase.type] : 'Organisation'
        const hasSubPhases = Boolean(node.subPhases?.length)

        return (
          <Accordion
            disableGutters
            elevation={0}
            expanded={expandedPhaseId === node.phase.id}
            key={node.phase.id}
            onChange={(_event, expanded) => setExpandedPhaseId(expanded ? node.phase.id : false)}
            square
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:not(:last-child)': { borderBottom: 0 },
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              aria-label={`${node.phase.name} ${phaseTypeLabel}`}
              component="div"
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: 'background.default',
                minHeight: 56,
                [`&.${accordionSummaryClasses.expanded}`]: { minHeight: 56 },
                [`& .${accordionSummaryClasses.content}`]: { my: 1.5 },
                [`& .${accordionSummaryClasses.content}.${accordionSummaryClasses.expanded}`]: { my: 1.5 },
              }}
            >
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={1}
                sx={{ minWidth: 0, pr: 2, width: '100%' }}
              >
                <Stack alignItems="center" direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                  <Box
                    sx={{
                      alignItems: 'center',
                      bgcolor: 'primary.main',
                      borderRadius: '50%',
                      color: 'primary.contrastText',
                      display: 'flex',
                      flex: '0 0 auto',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      height: 32,
                      justifyContent: 'center',
                      width: 32,
                    }}
                  >
                    {node.phase.order}
                  </Box>
                  <Typography fontWeight={800} noWrap>{node.phase.name}</Typography>
                  <Chip label={phaseTypeLabel} size="small" />
                </Stack>

                <Stack
                  direction="row"
                  onClick={(event) => event.stopPropagation()}
                  onFocus={(event) => event.stopPropagation()}
                  onMouseDown={(event) => event.stopPropagation()}
                  spacing={0.5}
                >
                  <IconButton
                    aria-label={`Editer ${node.phase.name}`}
                    onClick={(event) => handleEdit(event, node.phase)}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <DeleteButton
                    ariaLabel={`Supprimer ${node.phase.name}`}
                    onConfirm={() => onDelete(node.phase)}
                  />
                </Stack>
              </Stack>
            </AccordionSummary>

            <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', p: 3 }}>
              <Stack spacing={2.5}>
                {node.phase.details?.trim() ? (
                  <MarkdownContent content={node.phase.details.trim()} />
                ) : null}

                <Paper
                  aria-label={`Organisation de ${node.phase.name}`}
                  component="section"
                  variant="outlined"
                  sx={{ borderRadius: 2, maxWidth: 720, overflow: 'hidden', width: '100%' }}
                >
                  <Typography
                    component="h3"
                    fontWeight={800}
                    sx={{ bgcolor: 'background.default', px: 2, py: 1.5 }}
                  >
                    Organisation
                  </Typography>
                  <Divider />

                  {hasSubPhases ? (
                    <List component="div" disablePadding aria-label={`Éléments de l'organisation de ${node.phase.name}`}>
                      {node.subPhases?.map((subPhase) => (
                        <PhaseTreeItem
                          key={subPhase.phase.id}
                          node={subPhase}
                          onDelete={onDelete}
                          onEdit={onEdit}
                        />
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" sx={{ p: 2 }}>Aucun élément dans cette organisation.</Typography>
                  )}
                </Paper>
              </Stack>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Stack>
  )
}
