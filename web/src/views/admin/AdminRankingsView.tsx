import {
  Alert,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useState } from 'react'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { usePhases } from '../../hooks/usePhases'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'

export const AdminRankingsView = () => {
  const { phases, isLoading: isPhasesLoading, errorMessage: phasesError } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [showGlobalRanking, setShowGlobalRanking] = useState(false)
  const rootPhases = getRootPhases(phases)
  const effectiveSelectedPhaseId = selectedPhaseId ?? rootPhases.at(-1)?.id ?? null
  const selectedPhase = rootPhases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []

  return (
    <Stack spacing={3}>
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
                  checked={showGlobalRanking}
                  onChange={(event) => setShowGlobalRanking(event.target.checked)}
                />
              }
              label="Classement global"
              sx={{ flexShrink: 0, ml: { xs: 0, sm: 2 } }}
            />
          </Stack>
          {poolPhases.length > 0 ? (
            showGlobalRanking && selectedPhase ? (
              <PhaseRankingCard extended phase={selectedPhase} />
            ) : (
              poolPhases.map((phase) => (
                <PhaseRankingCard extended key={phase.id} phase={phase} />
              ))
            )
          ) : selectedPhase ? (
            <Alert severity="info">Aucune poule n'est disponible pour cette phase.</Alert>
          ) : null}
        </>
      )}
    </Stack>
  )
}
