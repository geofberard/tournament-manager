import { useState } from 'react'
import { Alert, Box, CircularProgress, Stack, Tab, Tabs } from '@mui/material'
import { usePhases } from '../../hooks/usePhases'
import { usePublicLayout } from '../../hooks/usePublicLayout'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'

export const PublicRankingsView = () => {
  const { phases, isLoading, errorMessage } = usePhases()
  const { isLargeScreen } = usePublicLayout()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const rootPhases = getRootPhases(phases)
  const selectedPhase = rootPhases.find((phase) => phase.id === selectedPhaseId) ?? rootPhases.at(-1) ?? null
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []

  if (isLoading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
  }

  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  return (
    <Stack sx={{ maxWidth: isLargeScreen ? 'none' : 900, mx: 'auto' }}>
      {rootPhases.length > 0 && (
        <Tabs
          value={selectedPhase?.id ?? false}
          onChange={(_event, value: string) => setSelectedPhaseId(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Phases du tournoi"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          {rootPhases.map((phase) => <Tab key={phase.id} value={phase.id} label={phase.name} />)}
        </Tabs>
      )}

      {poolPhases.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen && poolPhases.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            columnGap: 3,
          }}
        >
          {poolPhases.map((phase) => <PhaseRankingCard key={phase.id} phase={phase} />)}
        </Box>
      ) : (
        <Alert severity="info">Aucune poule n'est disponible pour cette phase.</Alert>
      )}
    </Stack>
  )
}
