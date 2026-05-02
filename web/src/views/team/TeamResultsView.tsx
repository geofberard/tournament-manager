import { Alert, CircularProgress, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { TeamResultsContent } from '../../components/team/TeamResultsContent'
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
  const phaseDetailsParagraphs = selectedPhase?.details
    ?.split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean) ?? []

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Bienvenue {currentTeam.name}</Typography>
        <Typography variant="body1" color="text.secondary">
          Retrouvez ici les resultats de votre groupe et suivez votre position dans chaque phase.
        </Typography>
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
        <Typography variant="h3">Resultats</Typography>
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
            {phaseDetailsParagraphs.length > 0 ? (
              <Stack spacing={1.5}>
                {phaseDetailsParagraphs.map((paragraph, index) => (
                  <Typography key={`${selectedPhase?.id ?? 'phase'}-${index}`} variant="body1">
                    {paragraph}
                  </Typography>
                ))}
              </Stack>
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
