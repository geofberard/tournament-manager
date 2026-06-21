import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { GameStatus, type Team } from '../../generated/api-client'
import { TEAM_REFEREE_GAME_PATH } from '../../app/routes'
import type { Game } from '../../services/gamesService'
import type { DisplayedGameStatus } from '../../services/gameStatus'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsIcon from '@mui/icons-material/Sports';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';

type GameCardProps = {
  game: Game,
  currentTeam: Team
  displayedStatus: DisplayedGameStatus
  waitingGamesCount?: number
}

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

const statusLabelByValue: Record<DisplayedGameStatus, string> = {
  completed: 'Terminé',
  in_progress: 'En cours',
  scheduled: 'Planifié',
}

const statusColorByValue: Record<DisplayedGameStatus, 'default' | 'error' | 'info' | 'success'> = {
  completed: 'default',
  in_progress: 'success',
  scheduled: 'info',
}

const formatScore = (game: Game) => {
  const scores = Array.from(game.contestants).map(
    (team) => game.score?.pointsByTeam?.[team.id] ?? '-',
  )

  return scores.join(' - ')
}

export const GameCard = ({ game, currentTeam, displayedStatus, waitingGamesCount }: GameCardProps) => {
  const navigate = useNavigate()

  const handleRefereeClick = () => {
    navigate(TEAM_REFEREE_GAME_PATH.replace(':id', game.id))
  }

  const teams = Array.from(game.contestants);
  const isReferee = game.referee?.id === currentTeam.id
  const isContestant = teams.some((team) => team.id === currentTeam.id)
  const isCompleted = game.status === GameStatus.Completed;
  const isInProgress = displayedStatus === 'in_progress'

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
            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1} useFlexGap>
              {waitingGamesCount != null ? (
                <Chip
                  avatar={<AccessTimeOutlinedIcon />}
                  label={`Attente : ${waitingGamesCount} match${waitingGamesCount > 1 ? 's' : ''}`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
              ) : null}
              {game.subgroup ? (
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {game.subgroup}
                </Typography>
              ) : null}
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
              <Chip label={game.phase.name} variant="filled" size="small" />
              <Chip label={game.group} variant="outlined" size="small" />
              <Chip
                label={statusLabelByValue[displayedStatus]}
                color={statusColorByValue[displayedStatus]}
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
                  {displayedStatus === 'scheduled' ? ' vs ' : formatScore(game)}
                </Typography>
              }
              color={statusColorByValue[displayedStatus]}
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
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
                spacing={1}
                useFlexGap
                sx={{ mb: 1 }}
              >
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

              {/* Affichage de l'arbitre et du bouton d'arbitrage */}
              {game.referee ? (
                isReferee ? (
                  <Stack
                    alignItems={{ sm: 'stretch' }}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                  >
                    <Alert severity="warning" icon={<SportsIcon />} sx={{ flex: 1, py: 0 }}>
                      Votre équipe arbitre ce match
                    </Alert>
                    {isInProgress ? (
                      <Button
                        color="warning"
                        endIcon={<ScoreboardOutlinedIcon />}
                        onClick={handleRefereeClick}
                        sx={{ whiteSpace: 'nowrap' }}
                        variant="outlined"
                      >
                        Accéder à l'arbitrage
                      </Button>
                    ) : null}
                  </Stack>
                ) : (
                  <Alert severity="info" icon={<SportsIcon />} sx={{ py: 0 }}>
                    {isContestant
                      ? `Vous serez arbitré par ${game.referee.name}`
                      : `Arbitre : ${game.referee.name}`}
                  </Alert>
                )
              ) : (
                <Stack
                  alignItems={{ sm: 'stretch' }}
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                >
                  <Alert severity="warning" icon={<SportsIcon />} sx={{ flex: 1, py: 0 }}>
                    Les équipes doivent s'auto-arbitrer
                  </Alert>
                  {isInProgress && isContestant ? (
                    <Button
                      color="warning"
                      endIcon={<ScoreboardOutlinedIcon />}
                      onClick={handleRefereeClick}
                      sx={{ whiteSpace: 'nowrap' }}
                      variant="outlined"
                    >
                      Saisir le score
                    </Button>
                  ) : null}
                </Stack>
              )}

            </>) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
