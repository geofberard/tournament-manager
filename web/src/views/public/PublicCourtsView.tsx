import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGames } from '../../hooks/useGames'
import { usePublicLayout } from '../../hooks/usePublicLayout'
import { getPublicCourtPath } from '../../app/routes'
import { buildCourtSchedules } from '../../services/courtSchedule'
import { CourtCard } from '../../components/public/CourtCard'

export const PublicCourtsView = () => {
  const { games, isLoading, errorMessage } = useGames()
  const navigate = useNavigate()
  const { isLargeScreen } = usePublicLayout()
  const schedules = buildCourtSchedules(games)

  if (isLoading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
  }

  return (
    <Box>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {schedules.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Aucun match planifié sur les terrains.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {schedules.map((schedule) => (
            <CourtCard
              key={schedule.court}
              schedule={schedule}
              variant={isLargeScreen ? 'scoreboard' : 'compact'}
              onClick={() => navigate(getPublicCourtPath(schedule.court))}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
