import {
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GameStatus } from '../../generated/api-client'
import { TEAM_REFEREE_GAME_PATH } from '../../app/routes'
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
  [GameStatus.Completed]: 'default',
  [GameStatus.InProgress]: 'info',
  [GameStatus.Scheduled]: 'info',
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
  const navigate = useNavigate()

  const handleRefereeClick = () => {
    navigate(TEAM_REFEREE_GAME_PATH.replace(':id', game.id))
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              {game.subgroup ? (
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {game.subgroup}
                </Typography>
              ) : null}
              <Typography variant="body2" color="text.secondary">
                {formatContestants(game)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
              <Chip label={game.phase.name} variant="filled" size="small" />
              <Chip label={game.group} variant="outlined" size="small" />
              <Chip
                label={statusLabelByValue[game.status] ?? game.status}
                color={statusColorByValue[game.status] ?? 'default'}
                size="small"
              />
            </Stack>
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

          {game.status === GameStatus.InProgress || game.status === GameStatus.Scheduled ? (
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="outlined" size="small" onClick={handleRefereeClick} color="success">
                {game.status === GameStatus.Scheduled ? 'Arbitrer le match' : 'Continuer l\'arbitrage'}
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
