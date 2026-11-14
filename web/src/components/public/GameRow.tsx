import { Fragment } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import type { Game } from '../../services/gamesService'
import { formatGameTime, getGameTeams, getTeamPoints, getWinnerId, hasScore } from '../../services/courtSchedule'
import { statusColorByValue, statusLabelByValue, type DisplayedGameStatus } from '../../services/gameStatus'

type GameRowProps = {
  game: Game
  status: DisplayedGameStatus
  showCourt?: boolean
  showTime?: boolean
  showStatusLabel?: boolean
}

export const GameRow = ({ game, status, showCourt = false, showTime = true, showStatusLabel = true }: GameRowProps) => {
  const teams = getGameTeams(game)
  const time = formatGameTime(game)
  const isCompleted = status === 'completed'
  const winnerId = isCompleted ? getWinnerId(game) : null
  const showScore = status !== 'scheduled' && hasScore(game)
  const details = [
    showCourt ? game.court : null,
    `Arbitre : ${game.referee?.name ?? 'auto-arbitrage'}`,
  ].filter(Boolean).join(' · ')

  return (
    <Stack direction="row" alignItems="center" gap={1.5} sx={{ py: 1.25 }}>
      {showTime && (
        <Typography
          fontWeight={700}
          color={isCompleted ? 'text.secondary' : 'text.primary'}
          sx={{ minWidth: 48, fontVariantNumeric: 'tabular-nums' }}
        >
          {time ?? '--:--'}
        </Typography>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ overflowWrap: 'break-word' }}>
          {teams.map((team, index) => {
            const isWinner = team.id === winnerId

            return (
              <Fragment key={team.id}>
                {index > 0 && <Typography component="span" color="text.secondary" sx={{ mx: 0.75 }}>vs</Typography>}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: isWinner ? 800 : isCompleted ? 400 : 500,
                    color: isCompleted && !isWinner ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {team.name}
                </Typography>
                {isWinner && (
                  <EmojiEventsIcon
                    color="warning"
                    titleAccess="Vainqueur"
                    sx={{ fontSize: 18, ml: 0.5, verticalAlign: 'text-bottom' }}
                  />
                )}
              </Fragment>
            )
          })}
        </Typography>
        <Typography variant="caption" color="text.secondary">{details}</Typography>
      </Box>
      {(showScore || showStatusLabel) && (
        <Chip
          size="small"
          color={statusColorByValue[status]}
          label={showScore ? teams.map((team) => getTeamPoints(game, team.id) ?? '-').join(' - ') : statusLabelByValue[status]}
          aria-label={statusLabelByValue[status]}
          sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
        />
      )}
    </Stack>
  )
}
