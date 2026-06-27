import { Alert, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useState } from 'react'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { usePhases } from '../../hooks/usePhases'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'

export const AdminRankingsView = () => {
  const { phases, isLoading: isPhasesLoading, errorMessage: phasesError } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const rootPhases = getRootPhases(phases)
  const effectiveSelectedPhaseId = selectedPhaseId ?? rootPhases[0]?.id ?? null
  const selectedPhase = rootPhases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []

  return (
    <Stack spacing={3} sx={{ maxWidth: 960, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
      <Stack direction="row" alignItems="center" gap={1.5}>
        <EmojiEventsIcon fontSize="large" />
        <Typography variant="h1">Classements</Typography>
      </Stack>

      {phasesError ? <Alert severity="error">{phasesError}</Alert> : null}
      {isPhasesLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : rootPhases.length === 0 ? (
        <Alert severity="info">Aucune phase n'est disponible pour le moment.</Alert>
      ) : (
        <>
          <Tabs
            value={effectiveSelectedPhaseId ?? false}
            onChange={(_event, value: string) => setSelectedPhaseId(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Phases du tournoi"
          >
            {rootPhases.map((phase) => (
              <Tab key={phase.id} value={phase.id} label={phase.name} />
            ))}
          </Tabs>
          {poolPhases.length > 0 ? (
            poolPhases.map((phase) => (
              <PhaseRankingCard extended key={phase.id} phaseId={phase.id} phaseName={phase.name} />
            ))
          ) : selectedPhase ? (
            <Alert severity="info">Aucune poule n'est disponible pour cette phase.</Alert>
          ) : null}
        </>
      )}
    </Stack>
  )
}
