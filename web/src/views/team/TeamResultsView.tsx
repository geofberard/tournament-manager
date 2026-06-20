import { Alert, CircularProgress, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { TeamResultsContent } from '../../components/team/TeamResultsContent'
import { MarkdownContent } from '../../components/shared/MarkdownContent'
import { useState } from 'react'
import { usePhases } from '../../hooks/usePhases'
import type { Team } from '../../services/teamsService'

type TeamResultsViewProps = {
  currentTeam: Team
}

export const TeamResultsView = ({ currentTeam }: TeamResultsViewProps) => {
  const { errorMessage: phasesErrorMessage, isLoading: isPhasesLoading, phases } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const effectiveSelectedPhaseId = selectedPhaseId ?? phases[0]?.id ?? null
  const selectedPhase = phases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null
  const phaseDetails = selectedPhase?.details?.trim() ?? ''

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Bienvenue {currentTeam.name}</Typography>
      </Stack>

      {isPhasesLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {phasesErrorMessage ? (
        <Alert severity="warning">Les phases sont indisponibles pour le moment.</Alert>
      ) : null}

      <Stack spacing={2}>
        {phases.length > 0 ? (
          <Tabs
            value={effectiveSelectedPhaseId ?? false}
            onChange={(_event, value: string) => setSelectedPhaseId(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Phases du tournoi"
          >
            {phases.map((phase) => (
              <Tab key={phase.id} value={phase.id} label={phase.name} />
            ))}
          </Tabs>
        ) : null}
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            {phaseDetails ? (
              <MarkdownContent content={phaseDetails} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Aucun detail n'est disponible pour cette phase.
              </Typography>
            )}
          </Stack>
        </Paper>
        <TeamResultsContent currentTeam={currentTeam} selectedPhase={selectedPhase} />
      </Stack>
    </Stack>
  )
}
