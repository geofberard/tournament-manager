import {
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { GameStatus } from '../../generated/api-client'
import type { Game } from '../../services/gamesService'

type GameCardProps = {
  game: Game
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const statusLabelByValue: Record<string, string> = {
  [GameStatus.Completed]: 'Termine',
  [GameStatus.InProgress]: 'En cours',
  [GameStatus.Scheduled]: 'Planifie',
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

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <Card variant="outlined">
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
            {dateFormatter.format(game.time)} - Terrain {game.court}
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
  )
}
