import { Alert, CircularProgress, FormControlLabel, Paper, Stack, Switch, Tab, Tabs, Typography } from '@mui/material'
import { TeamResultsContent } from '../../components/team/TeamResultsContent'
import { MarkdownContent } from '../../components/shared/MarkdownContent'
import { useState } from 'react'
import { usePhases } from '../../hooks/usePhases'
import { getPoolPhasesInBranch, getRootPhases, resolvePhaseType } from '../../services/phaseHierarchy'
import type { Team } from '../../services/teamsService'

type TeamResultsViewProps = {
  currentTeam: Team
}

export const TeamResultsView = ({ currentTeam }: TeamResultsViewProps) => {
  const { errorMessage: phasesErrorMessage, isLoading: isPhasesLoading, phases } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [showAllResults, setShowAllResults] = useState(false)
  const rootPhases = getRootPhases(phases)
  const effectiveSelectedPhaseId = selectedPhaseId ?? rootPhases.at(-1)?.id ?? null
  const selectedPhase = rootPhases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null
  const selectedPhaseWithInheritedType = selectedPhase
    ? { ...selectedPhase, type: resolvePhaseType(phases, selectedPhase) }
    : null
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []
  const phaseDetails = selectedPhase?.details?.trim() ?? ''

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Résultats</Typography>

      {isPhasesLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {phasesErrorMessage ? (
        <Alert severity="warning">Les phases sont indisponibles pour le moment.</Alert>
      ) : null}

      <Stack spacing={2}>
        {rootPhases.length > 0 ? (
          <Stack
            alignItems={{ xs: 'stretch', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Tabs
              value={effectiveSelectedPhaseId ?? false}
              onChange={(_event, value: string) => setSelectedPhaseId(value)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Phases du tournoi"
              sx={{ flex: 1, minWidth: 0 }}
            >
              {rootPhases.map((phase) => (
                <Tab key={phase.id} value={phase.id} label={phase.name} />
              ))}
            </Tabs>
            <FormControlLabel
              control={
                <Switch
                  checked={showAllResults}
                  onChange={(event) => setShowAllResults(event.target.checked)}
                />
              }
              label="Tous les résultats"
              sx={{ flexShrink: 0, ml: { xs: 0, sm: 2 } }}
            />
          </Stack>
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
        <TeamResultsContent
          currentTeam={currentTeam}
          poolPhases={poolPhases}
          selectedPhase={selectedPhaseWithInheritedType}
          showAllResults={showAllResults}
        />
      </Stack>
    </Stack>
  )
}
