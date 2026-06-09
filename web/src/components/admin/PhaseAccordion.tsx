import type { SyntheticEvent } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { accordionSummaryClasses } from '@mui/material/AccordionSummary'
import { MarkdownContent } from '../shared/MarkdownContent'
import type { Phase } from '../../services/phasesService'

const phaseTypeLabels: Record<Phase['type'], string> = {
  BRACKET: 'Elimination',
  POOL: 'Poules',
}

type PhaseAccordionProps = {
  expanded: boolean
  onChange: (event: SyntheticEvent, isExpanded: boolean) => void
  onEdit: (phase: Phase) => void
  phase: Phase
}

export const PhaseAccordion = ({ expanded, onChange, onEdit, phase }: PhaseAccordionProps) => {
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
        aria-label={`${phase.name} ${phaseTypeLabels[phase.type]}`}
        component="div"
        expandIcon={<Typography aria-hidden="true">⌄</Typography>}
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
              <Chip label={phaseTypeLabels[phase.type]} size="small" sx={{ flex: '0 0 auto' }} />
            </Stack>
          </Stack>
          <Button
            onClick={(event) => {
              event.stopPropagation()
              onEdit(phase)
            }}
            onFocus={(event) => event.stopPropagation()}
            size="small"
            sx={{ flex: '0 0 auto' }}
            variant="outlined"
          >
            Editer
          </Button>
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
