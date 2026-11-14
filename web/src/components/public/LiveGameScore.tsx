import { Box, Stack, Typography } from '@mui/material'
import type { Game } from '../../services/gamesService'
import { getGameTeams, getTeamPoints, hasScore } from '../../services/courtSchedule'
import { LiveChip } from '../shared/LiveChip'

type LiveGameScoreProps = {
  game: Game | null
  size?: 'regular' | 'large'
}

export const LiveGameScore = ({ game, size = 'regular' }: LiveGameScoreProps) => {
  if (!game) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        Pas de match en cours
      </Typography>
    )
  }

  const isLarge = size === 'large'
  const teamNameSx = { overflowWrap: 'break-word', fontWeight: 600, fontSize: isLarge ? { xs: 16, md: 20 } : 16 } as const
  const [firstTeam, secondTeam] = getGameTeams(game)
  const showScore = hasScore(game)
  const formatPoints = (teamId?: string) => (teamId ? getTeamPoints(game, teamId) ?? 0 : 0)

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <LiveChip />
        <Typography variant="caption" color="text.secondary" noWrap>
          Arbitre : {game.referee?.name ?? 'auto-arbitrage'}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Typography sx={teamNameSx}>
          {firstTeam?.name}
        </Typography>
        <Typography
          component="span"
          fontWeight={700}
          sx={{
            fontSize: isLarge ? { xs: 32, md: 48 } : 24,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
          color={showScore ? 'text.primary' : 'text.secondary'}
        >
          {showScore ? `${formatPoints(firstTeam?.id)} - ${formatPoints(secondTeam?.id)}` : 'vs'}
        </Typography>
        <Typography textAlign="right" sx={teamNameSx}>
          {secondTeam?.name}
        </Typography>
      </Box>
    </Stack>
  )
}
