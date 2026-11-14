import { useState } from 'react'
import { Alert, Box, Card, Chip, CircularProgress, Divider, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useGames } from '../../hooks/useGames'
import { usePublicLayout } from '../../hooks/usePublicLayout'
import type { Game } from '../../services/gamesService'
import { buildCourtSchedules, formatGameTime, hasValidTime } from '../../services/courtSchedule'
import { GameRow } from '../../components/public/GameRow'
import { statusColorByValue, statusLabelByValue, type DisplayedGameStatus } from '../../services/gameStatus'
import { LiveChip } from '../../components/shared/LiveChip'

type GamesFilter = 'upcoming' | 'completed'

type GameGroup = {
  label: string
  games: Game[]
}

const compareByTime = (left: Game, right: Game, direction: 'asc' | 'desc' = 'asc') => {
  const order = direction === 'asc' ? 1 : -1
  if (hasValidTime(left) && hasValidTime(right)) return order * (left.time.getTime() - right.time.getTime())
  if (hasValidTime(left)) return -1
  if (hasValidTime(right)) return 1
  return order * ((left.position ?? 0) - (right.position ?? 0))
}

const groupByTimeSlot = (games: Game[]): GameGroup[] =>
  games.reduce<GameGroup[]>((groups, game) => {
    const label = formatGameTime(game) ?? 'Horaire à définir'
    const lastGroup = groups.at(-1)

    if (lastGroup?.label === label) {
      lastGroup.games.push(game)
    } else {
      groups.push({ label, games: [game] })
    }

    return groups
  }, [])

const GameGroupCard = ({ group, status }: { group: GameGroup, status: DisplayedGameStatus }) => (
  <Box>
    <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
      <Typography variant={status === 'in_progress' ? 'h6' : 'subtitle1'} component="h2" fontWeight={700}>
        {group.label}
      </Typography>
      {status === 'in_progress' && <LiveChip />}
    </Stack>
    <Card variant="outlined" sx={{ borderRadius: 3, px: 2 }}>
      <Stack divider={<Divider flexItem />}>
        {group.games.map((game) => (
          <GameRow
            key={game.id}
            game={game}
            showCourt
            showTime={false}
            status={status}
            showStatusLabel={status === 'completed'}
          />
        ))}
      </Stack>
    </Card>
  </Box>
)

export const PublicGamesView = () => {
  const [filter, setFilter] = useState<GamesFilter>('upcoming')
  const { games, isLoading, errorMessage } = useGames()
  const { isLargeScreen } = usePublicLayout()
  const schedules = buildCourtSchedules(games)

  const liveGames = schedules.flatMap((schedule) => (schedule.currentGame ? [schedule.currentGame] : []))
  const upcomingGroups = groupByTimeSlot(schedules.flatMap((schedule) => schedule.upcomingGames).sort((left, right) => compareByTime(left, right)))
  const completedGroups = groupByTimeSlot(
    schedules.flatMap((schedule) => schedule.completedGames).sort((left, right) => compareByTime(left, right, 'desc')),
  )

  return (
    <Stack spacing={3} sx={{ maxWidth: isLargeScreen ? 'none' : 800, mx: 'auto' }}>
      <Tabs
        value={filter}
        onChange={(_event, value: GamesFilter) => setFilter(value)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Filtrer les matchs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab value="upcoming" label="À venir" />
        <Tab value="completed" label="Terminés" />
      </Tabs>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : filter === 'upcoming' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen && liveGames.length > 0 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            gap: 3,
            alignItems: 'start',
          }}
        >
          {liveGames.length > 0 && <GameGroupCard group={{ label: 'En ce moment', games: liveGames }} status="in_progress" />}
          <Stack spacing={3}>
            {upcomingGroups.length > 0 && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h6" component="h2" fontWeight={700}>Prochains matchs</Typography>
                <Chip size="small" label={statusLabelByValue.scheduled} color={statusColorByValue.scheduled} sx={{ fontWeight: 700 }} />
              </Stack>
            )}
            {upcomingGroups.map((group) => <GameGroupCard key={group.label} group={group} status="scheduled" />)}
            {liveGames.length === 0 && upcomingGroups.length === 0 && (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Aucun match à venir.</Typography>
            )}
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isLargeScreen ? 'repeat(2, minmax(0, 1fr))' : '1fr',
            gap: 3,
            alignItems: 'start',
          }}
        >
          {completedGroups.map((group) => <GameGroupCard key={group.label} group={group} status="completed" />)}
          {completedGroups.length === 0 && (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Aucun match terminé pour le moment.</Typography>
          )}
        </Box>
      )}
    </Stack>
  )
}
