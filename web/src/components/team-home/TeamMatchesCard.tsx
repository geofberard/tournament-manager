import {
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'

type TeamMatchesCardProps = {
  errorMessage: string | null
  games: Game[]
  isLoading: boolean
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const statusLabelByValue: Record<string, string> = {
  [GameStatus.Completed]: 'Terminé',
  [GameStatus.InProgress]: 'En cours',
  [GameStatus.Scheduled]: 'Planifié',
}

const statusColorByValue: Record<string, 'default' | 'error' | 'info' | 'success'> = {
  [GameStatus.Completed]: 'success',
  [GameStatus.InProgress]: 'info',
  [GameStatus.Scheduled]: 'default',
}

const formatContestants = (game: Game) =>
  Array.from(game.contestants)
    .map((team) => team.name)
    .join(' vs ')

const formatScore = (game: Game) => {
  const scores = Array.from(game.contestants).map(
    (team) => game.score?.pointsByTeam?.[team.id] ?? '-',
  )

  return scores.join(' - ')
}

export function TeamMatchesCard({
  errorMessage,
  games,
  isLoading,
}: TeamMatchesCardProps) {
  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  if (!isLoading && games.length === 0) {
    return <Alert severity="info">Aucun match n'est encore planifié pour cette équipe.</Alert>
  }

  return (
    <Stack spacing={2}>
      {games.map((game) => (
        <Card key={game.id} variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {formatContestants(game)}
                </Typography>
                <Chip
                  label={statusLabelByValue[game.status] ?? game.status}
                  color={statusColorByValue[game.status] ?? 'default'}
                  size="small"
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {dateFormatter.format(game.time)} · Terrain {game.court}
              </Typography>

              <Divider />

              <Typography variant="body2">
                Score: <strong>{formatScore(game)}</strong>
              </Typography>

              {game.referee ? (
                <Typography variant="body2" color="text.secondary">
                  Arbitre: {game.referee.name}
                </Typography>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
