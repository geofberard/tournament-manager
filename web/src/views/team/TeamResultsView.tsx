import { Alert, CircularProgress, FormControlLabel, Paper, Stack, Switch, Tab, Tabs, Typography } from '@mui/material'
import { MarkdownContent } from '../../components/shared/MarkdownContent'
import { useState } from 'react'
import useSWR from 'swr'
import { usePhases } from '../../hooks/usePhases'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'
import { listPhasesStatistics, type PhaseStatistics } from '../../services/statisticsService'
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
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []
  const poolPhaseIds = poolPhases.map((phase) => phase.id)
  const {
    data: poolPhasesStatistics = [],
    error: poolPhasesStatisticsError,
    isLoading: isPoolPhasesStatisticsLoading,
  } = useSWR<PhaseStatistics[]>(
    poolPhaseIds.length > 0 ? ['/api/phases/statistics/team-results', poolPhaseIds.join('|')] : null,
    async () => listPhasesStatistics(poolPhaseIds),
  )
  const phaseDetails = selectedPhase?.details?.trim() ?? ''
  const statisticsByPhaseId = new Map(
    poolPhases.map((phase, index) => [phase.id, poolPhasesStatistics[index]]),
  )
  const visiblePoolPhases = showAllResults
    ? poolPhases
    : poolPhases.filter((phase) =>
      statisticsByPhaseId.get(phase.id)?.teams.some((team) => team.id === currentTeam.id),
    )

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
        {!selectedPhase ? (
          <Alert severity="info">Aucune phase n'est disponible pour le moment.</Alert>
        ) : poolPhases.length === 0 ? (
          <Alert severity="info">Aucune poule n'est disponible pour cette phase.</Alert>
        ) : isPoolPhasesStatisticsLoading ? (
          <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
            <CircularProgress />
          </Stack>
        ) : poolPhasesStatisticsError ? (
          <Alert severity="error">Le chargement des resultats a echoue.</Alert>
        ) : visiblePoolPhases.length === 0 ? (
          <Alert severity="info">Aucun résultat n'est disponible pour cette équipe dans cette phase.</Alert>
        ) : (
          <Stack>
            {visiblePoolPhases.map((phase) => (
              <PhaseRankingCard currentTeamId={currentTeam.id} key={phase.id} phase={phase} />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
