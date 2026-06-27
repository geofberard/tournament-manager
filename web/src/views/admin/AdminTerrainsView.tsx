import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import StadiumIcon from '@mui/icons-material/Stadium'
import { PitchStatus } from '../../components/shared/PitchStatus'
import { useGames } from '../../hooks/useGames'

export const AdminTerrainsView = () => {
  const { games, isLoading, errorMessage } = useGames()

  return (
    <Stack spacing={3}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <StadiumIcon fontSize="large" />
        <Typography variant="h1">Terrains</Typography>
      </Box>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <PitchStatus games={games} />
      )}
    </Stack>
  )
}
