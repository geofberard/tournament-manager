import { Card, CardActionArea, CardContent, Divider, Stack, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { CourtSchedule } from '../../services/courtSchedule'
import { formatGameTime, getGameTeams, getTeamPoints, hasScore } from '../../services/courtSchedule'
import type { Game } from '../../services/gamesService'
import { LiveChip, LiveGameScore } from './LiveGameScore'

type CourtCardProps = {
  schedule: CourtSchedule
  onClick: () => void
  variant?: 'compact' | 'scoreboard'
}

const formatNextGame = (game: Game) => {
  const time = formatGameTime(game)
  return `${time ? `${time} · ` : ''}${getGameTeams(game).map((team) => team.name).join(' vs ')}`
}

const Scoreboard = ({ schedule }: { schedule: CourtSchedule }) => {
  const game = schedule.currentGame
  const [nextGame] = schedule.upcomingGames
  const teams = game ? getGameTeams(game) : []

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Typography variant="h6" fontWeight={700}>{schedule.court}</Typography>
        {game && <LiveChip />}
      </Stack>

      {game ? (
        <>
          <Typography
            textAlign="center"
            fontWeight={700}
            color={hasScore(game) ? 'text.primary' : 'text.secondary'}
            sx={{ fontSize: 48, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}
          >
            {hasScore(game) ? teams.map((team) => getTeamPoints(game, team.id) ?? 0).join(' - ') : 'vs'}
          </Typography>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={600} fontSize={18} sx={{ flex: 1, minWidth: 0, overflowWrap: 'break-word' }}>{teams[0]?.name}</Typography>
            <Typography fontWeight={600} fontSize={18} textAlign="right" sx={{ flex: 1, minWidth: 0, overflowWrap: 'break-word' }}>
              {teams[1]?.name}
            </Typography>
          </Stack>
        </>
      ) : (
        <Typography color="text.secondary" textAlign="center" sx={{ fontStyle: 'italic', py: 3 }}>
          Pas de match en cours
        </Typography>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
        {nextGame ? `Ensuite : ${formatNextGame(nextGame)}` : 'Aucun autre match prévu'}
      </Typography>
    </>
  )
}

const Compact = ({ schedule }: { schedule: CourtSchedule }) => {
  const [nextGame, ...otherGames] = schedule.upcomingGames

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={700}>{schedule.court}</Typography>
        <ChevronRightIcon color="action" />
      </Stack>

      <LiveGameScore game={schedule.currentGame} />

      <Divider sx={{ mt: 'auto' }} />
      <Typography variant="body2" color="text.secondary">
        {nextGame
          ? `Ensuite ${formatNextGame(nextGame)}${otherGames.length > 0 ? ` · +${otherGames.length} autre${otherGames.length > 1 ? 's' : ''}` : ''}`
          : 'Aucun autre match prévu'}
      </Typography>
    </>
  )
}

export const CourtCard = ({ schedule, onClick, variant = 'compact' }: CourtCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
    <CardActionArea
      onClick={onClick}
      aria-label={`Voir le programme du ${schedule.court}`}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {variant === 'scoreboard' ? <Scoreboard schedule={schedule} /> : <Compact schedule={schedule} />}
      </CardContent>
    </CardActionArea>
  </Card>
)
