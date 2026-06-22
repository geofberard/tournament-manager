import type { SyntheticEvent } from 'react'
import type { MouseEvent } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { DeleteButton } from './DeleteButton'
import { MarkdownContent } from '../shared/MarkdownContent'
import type { Phase } from '../../services/phasesService'
import type { PhaseType } from '../../services/apiClient'

const phaseTypeLabels: Record<PhaseType, string> = {
  BRACKET: 'Elimination',
  POOL: 'Poules',
}

type PhaseAccordionProps = {
  expanded: boolean
  onChange: (event: SyntheticEvent, isExpanded: boolean) => void
  onDelete: (phase: Phase) => Promise<void> | void
  onEdit: (phase: Phase) => void
  phase: Phase
}

export const PhaseAccordion = ({ expanded, onChange, onDelete, onEdit, phase }: PhaseAccordionProps) => {
  const phaseTypeLabel = phase.type ? phaseTypeLabels[phase.type] : 'Organisation'
  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onEdit(phase)
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={onChange}
      square
      sx={{
        border: 1,
        borderColor: 'divider',
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        aria-label={`${phase.name} ${phaseTypeLabel}`}
        component="div"
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: 'background.default',
          minHeight: 56,
          [`&.${accordionSummaryClasses.expanded}`]: {
            minHeight: 56,
          },
          [`& .${accordionSummaryClasses.content}`]: {
            my: 1.5,
          },
          [`& .${accordionSummaryClasses.content}.${accordionSummaryClasses.expanded}`]: {
            my: 1.5,
          },
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
              {phase.order}
            </Box>
            <Stack
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{ minWidth: 0 }}
            >
              <Typography
                fontWeight={800}
                sx={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {phase.name}
              </Typography>
              <Chip label={phaseTypeLabel} size="small" sx={{ flex: '0 0 auto' }} />
            </Stack>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            spacing={1}
            sx={{ flex: '0 0 auto' }}
          >
            <IconButton aria-label="Editer" onClick={handleEditClick} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
            <DeleteButton onConfirm={() => onDelete(phase)} />
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
        <Stack spacing={1.5}>
          {phase.details?.trim() ? (
            <MarkdownContent content={phase.details.trim()} />
          ) : (
            <Typography color="text.secondary">Aucun detail renseigne.</Typography>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
