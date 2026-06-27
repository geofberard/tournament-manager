import { useEffect, useState } from 'react'
import { Alert, CircularProgress, Stack, Typography, Box, Paper, Divider, Tabs, Tab } from '@mui/material'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import StadiumIcon from '@mui/icons-material/Stadium'
import { usePhases } from '../../hooks/usePhases'
import { useGames } from '../../hooks/useGames'
import { PhaseRankingCard } from '../../components/shared/PhaseRankingCard'
import { PitchStatus } from '../../components/shared/PitchStatus'
import { QrCodeButton } from '../../components/shared/QrCodeButton'
import { TerrainMapButton } from '../../components/shared/TerrainMapButton'
import { BuvetteButton } from '../../components/shared/BuvetteButton'
import { getPoolPhasesInBranch, getRootPhases } from '../../services/phaseHierarchy'

const PUBLIC_REFRESH_INTERVAL = 30_000

export const PublicView = () => {
  const { phases, isLoading: isPhasesLoading, errorMessage: phasesError } = usePhases()

  useEffect(() => {
    const refreshInterval = window.setInterval(() => window.location.reload(), PUBLIC_REFRESH_INTERVAL)

    return () => window.clearInterval(refreshInterval)
  }, [])

  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)
  const rootPhases = getRootPhases(phases)
  const effectiveSelectedPhaseId = selectedPhaseId ?? rootPhases.at(-1)?.id ?? null
  const selectedPhase = rootPhases.find((phase) => phase.id === effectiveSelectedPhaseId) ?? null
  const poolPhases = selectedPhase ? getPoolPhasesInBranch(phases, selectedPhase) : []

  const { games, isLoading: isGamesLoading, errorMessage: gamesError } = useGames()

  if (isPhasesLoading) {
    return <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={8}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Chargement des phases du tournoi...
      </Typography>
      <CircularProgress />
    </Box>
  }

  if (phasesError) {
    return <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" py={8}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Erreur de chargement du tournoi
      </Typography>
      <Alert severity="error">{phasesError}</Alert>
    </Box>
  }

  if (!selectedPhase) {
    return (
      <Stack sx={{ maxWidth: 760, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
        <Alert severity="info" variant="outlined">Aucun tournoi n'est configuré pour le moment.</Alert>
      </Stack>
    )
  }

  return (
    <Stack spacing={4} direction={{ xs: 'column', md: 'row' }} sx={{ maxWidth: 1200, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>

      {/* Buvette, map and QR code buttons */}
      <BuvetteButton />
      <TerrainMapButton />
      <QrCodeButton />

      {/* Zone Gauche : Classements */}
      <Stack sx={{ width: { xs: '100%', md: '60%' }, gap: 3 }}>
        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <FormatListNumberedIcon fontSize="large" />
            <Typography variant="h4" fontWeight="bold">
              Classements
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {rootPhases.length > 0 && (
            <Tabs
              value={effectiveSelectedPhaseId ?? false}
              onChange={(_event, value: string) => setSelectedPhaseId(value)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Phases du tournoi"
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
            >
              {rootPhases.map((phase) => (
                <Tab key={phase.id} value={phase.id} label={phase.name} />
              ))}
            </Tabs>
          )}

          {poolPhases.length > 0 ? (
            poolPhases.map((phase) => (
              <PhaseRankingCard key={phase.id} phase={phase} />
            ))
          ) : (
            <Alert severity="info">Aucune poule n'est disponible pour cette phase.</Alert>
          )}
        </Paper>
      </Stack>

      {/* Zone Droite : Terrains */}
      <Stack sx={{ width: { xs: '100%', md: '40%' }, gap: 3 }}>
        <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <StadiumIcon fontSize="large" />
            <Typography variant="h4" fontWeight="bold">
              Terrains
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {gamesError && <Alert severity="error">{gamesError}</Alert>}
          {isGamesLoading ? (
            <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
          ) : (
            <PitchStatus games={games} />
          )}
        </Paper>
      </Stack>

    </Stack>
  )
}
