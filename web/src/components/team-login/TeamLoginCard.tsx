import {
  Alert,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from '@mui/material'
import scufMiniature from '../../assets/scuf-miniature.png'
import type { Team } from '../../services/teamsService'

type TeamLoginCardProps = {
  currentTeam: Team | null
  errorMessage: string | null
  isLoading: boolean
  onTeamChange: (event: SelectChangeEvent<string>) => void
  teams: Team[]
}

export function TeamLoginCard({
  currentTeam,
  errorMessage,
  isLoading,
  onTeamChange,
  teams,
}: TeamLoginCardProps) {
  return (
    <>
      <Card sx={{ maxWidth: '400px', width: '100%' }} elevation={5}>
        <CardMedia
          component="img"
          alt="VolleyBall"
          image={scufMiniature}
          title=""
        />
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          {isLoading ? <CircularProgress /> : null}

          {errorMessage ? (
            <Alert severity="error" sx={{ textAlign: 'left' }}>
              {errorMessage}
            </Alert>
          ) : null}

          {!isLoading && !errorMessage ? (
            <FormControl fullWidth>
              <InputLabel id="team-selector-label">Choisir une équipe</InputLabel>
              <Select
                labelId="team-selector-label"
                value={currentTeam?.id ?? ''}
                label="Choisir une équipe"
                onChange={onTeamChange}
              >
                <MenuItem value="">
                  <em>Aucune</em>
                </MenuItem>
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}

          {!isLoading && !errorMessage && currentTeam ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Équipe sélectionnée : {currentTeam.name}
            </Typography>
          ) : null}
        </CardContent>
      </Card>

      {!isLoading && !errorMessage && teams.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2, maxWidth: '400px', width: '100%' }}>
          Aucune équipe disponible.
        </Alert>
      ) : null}
    </>
  )
}
