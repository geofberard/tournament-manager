import { Alert, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useState } from 'react'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { usePhases } from '../../hooks/usePhases'

export const AdminRankingsView = () => {
  const { phases, isLoading: isPhasesLoading, errorMessage: phasesError } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const effectiveSelectedPhaseId = selectedPhaseId ?? phases[0]?.id ?? null
  const selectedPhase = phases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null

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
      ) : phases.length === 0 ? (
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
            {phases.map((phase) => (
              <Tab key={phase.id} value={phase.id} label={phase.name} />
            ))}
          </Tabs>
          {selectedPhase ? (
            <PhaseRankingCard extended phaseId={selectedPhase.id} phaseName={selectedPhase.name} />
          ) : null}
        </>
      )}
    </Stack>
  )
}
