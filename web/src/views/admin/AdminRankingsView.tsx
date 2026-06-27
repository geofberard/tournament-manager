import {
  Alert,
  Card,
  CardContent,
  CardHeader,
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
import useSWR from 'swr'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { RankingTable } from '../../components/shared/RankingTable'
import { usePhases } from '../../hooks/usePhases'
import { listPhaseRankings, type ContestantStats } from '../../services/statisticsService'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'
import type { Phase } from '../../services/phasesService'

type GlobalRankingCardProps = {
  poolPhases: Phase[]
}

const GlobalRankingCard = ({ poolPhases }: GlobalRankingCardProps) => {
  const phaseIds = poolPhases.map((phase) => phase.id)
  const { data, error, isLoading } = useSWR<ContestantStats[]>(
    phaseIds.length > 0 ? ['/api/phases/statistics/global', phaseIds.join('|')] : null,
    async () => (await Promise.all(phaseIds.map((phaseId) => listPhaseRankings(phaseId)))).flat(),
  )

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }} variant="elevation">
      <CardHeader
        avatar={<EmojiEventsIcon color="secondary" />}
        title={<Typography fontWeight="bold" variant="h6">Classement global</Typography>}
        sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', py: 1.5 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <RankingTable
          currentTeamId=""
          errorMessage={error instanceof Error ? error.message : error ? 'Le chargement des resultats a echoue.' : null}
          extended
          isLoading={isLoading}
          rankings={data ?? []}
        />
      </CardContent>
    </Card>
  )
}

export const AdminRankingsView = () => {
  const { phases, isLoading: isPhasesLoading, errorMessage: phasesError } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const [showGlobalRanking, setShowGlobalRanking] = useState(false)
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
            showGlobalRanking ? (
              <GlobalRankingCard poolPhases={poolPhases} />
            ) : (
              poolPhases.map((phase) => (
                <PhaseRankingCard extended key={phase.id} phaseId={phase.id} phaseName={phase.name} />
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
