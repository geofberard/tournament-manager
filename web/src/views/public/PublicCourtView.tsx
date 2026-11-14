import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate, useParams } from 'react-router-dom'
import { useGames } from '../../hooks/useGames'
import { buildCourtSchedules } from '../../services/courtSchedule'
import { CourtDetail } from '../../components/public/CourtDetail'
import { usePublicLayout } from '../../hooks/usePublicLayout'
import { getPublicCourtPath, PUBLIC_HOME_PATH } from '../../app/routes'

export const PublicCourtView = () => {
  const { court = '' } = useParams()
  const { games, isLoading, errorMessage } = useGames()
  const navigate = useNavigate()
  const { isLargeScreen } = usePublicLayout()
  const schedules = buildCourtSchedules(games)
  const schedule = schedules.find((candidate) => candidate.court === court)

  return (
    <Box sx={{ maxWidth: isLargeScreen ? 'none' : 960, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PUBLIC_HOME_PATH)} sx={{ ml: -1, mb: 1 }}>
        Tous les terrains
      </Button>
      <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1.5 }}>{court}</Typography>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : schedule ? (
        <CourtDetail
          schedule={schedule}
          courts={schedules.map((candidate) => candidate.court)}
          onSelectCourt={(selectedCourt) => navigate(getPublicCourtPath(selectedCourt), { replace: true })}
        />
      ) : (
        <Alert severity="info">Aucun match n'est prévu sur ce terrain.</Alert>
      )}
    </Box>
  )
}
