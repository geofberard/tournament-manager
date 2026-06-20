import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GameStatus, type Team } from '../../generated/api-client'
import { TEAM_REFEREE_GAME_PATH } from '../../app/routes'
import type { Game } from '../../services/gamesService'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsIcon from '@mui/icons-material/Sports';

type GameCardProps = {
  game: Game,
  currentTeam: Team
}

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

const statusLabelByValue: Record<string, string> = {
  [GameStatus.Completed]: 'Terminé',
  [GameStatus.InProgress]: 'En cours',
  [GameStatus.Scheduled]: 'Planifié',
}

const statusColorByValue: Record<string, 'default' | 'error' | 'info' | 'success'> = {
  [GameStatus.Completed]: 'default',
  [GameStatus.InProgress]: 'success',
  [GameStatus.Scheduled]: 'info',
}

const formatScore = (game: Game) => {
  const scores = Array.from(game.contestants).map(
    (team) => game.score?.pointsByTeam?.[team.id] ?? '-',
  )

  return scores.join(' - ')
}

export const GameCard = ({ game, currentTeam }: GameCardProps) => {
  const navigate = useNavigate()

  const handleRefereeClick = () => {
    navigate(TEAM_REFEREE_GAME_PATH.replace(':id', game.id))
  }

  const teams = Array.from(game.contestants);
  const isReferee = !teams.some(team => team.id === currentTeam.id)
  const isCompleted = game.status === GameStatus.Completed;

  let winnerIndex = -1;
  if (isCompleted && game.score?.pointsByTeam) {
    const score1 = game.score.pointsByTeam[teams[0]?.id] ?? 0;
    const score2 = game.score.pointsByTeam[teams[1]?.id] ?? 0;
    if (score1 > score2) winnerIndex = 0;
    else if (score2 > score1) winnerIndex = 1;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {game.subgroup ? (
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {game.subgroup}
              </Typography>
            ) : <div />}
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

          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ my: 1, py: 2, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                minWidth: 0,
                fontWeight: winnerIndex === 0 ? 800 : (isCompleted ? 400 : 600),
                color: isCompleted && winnerIndex !== 0 ? 'text.secondary' : 'text.primary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                textAlign: 'center'
              }}
            >
              <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {teams[0]?.name ?? '?'}
              </span>
              {winnerIndex === 0 && <EmojiEventsIcon color="warning" sx={{ flexShrink: 0 }} />}
            </Typography>
            <Chip
              label={
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {game.status === GameStatus.Scheduled ? ' vs ' : formatScore(game)}
                </Typography>
              }
              color={statusColorByValue[game.status]}
              sx={{ height: 'auto', py: 1, px: 2, borderRadius: 2 }}
            />
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                minWidth: 0,
                fontWeight: winnerIndex === 1 ? 800 : (isCompleted ? 400 : 600),
                color: isCompleted && winnerIndex !== 1 ? 'text.secondary' : 'text.primary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                textAlign: 'center'
              }}
            >
              {winnerIndex === 1 && <EmojiEventsIcon color="warning" sx={{ flexShrink: 0 }} />}
              <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {teams[1]?.name ?? '?'}
              </span>
            </Typography>
          </Stack>

          {!isCompleted ? (
            <>
              {/* Affichage du terrain et de l'horaire */}
              <Stack direction="row" justifyContent="center" spacing={1} >
                {game.court ? (
                  <Chip
                    avatar={<RoomOutlinedIcon />}
                    label={game.court}
                    variant="filled"
                    size="small" />
                ) : null}
                {game.time ? (
                  <Chip
                    avatar={<AccessTimeOutlinedIcon />}
                    label={timeFormatter.format(new Date(game.time))}
                    variant="filled"
                    size="small" />
                ) : null}
              </Stack>

              {game.status !== GameStatus.Scheduled ? (
                <Divider />
              ) : null}

              {/* Affichage de l'arbitre et du bouton d'arbitrage */}
              {game.referee ? (
                isReferee ? (
                  <Alert severity="warning" icon={<SportsIcon />} sx={{ py: 0 }}>
                    Votre équipe arbitre ce match
                  </Alert>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Arbitre : {game.referee.name}
                  </Typography>
                )
              ) : null}

              {game.status === GameStatus.InProgress ? (
                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="outlined" size="small" onClick={handleRefereeClick} color="success">
                    Arbitrer le match
                  </Button>
                </Stack>
              ) : null}
            </>) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
