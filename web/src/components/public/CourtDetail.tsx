import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import type { CourtSchedule } from '../../services/courtSchedule'
import { GameRow } from './GameRow'
import { LiveGameScore } from './LiveGameScore'

type CourtDetailProps = {
  schedule: CourtSchedule
  courts: string[]
  onSelectCourt: (court: string) => void
  layout?: 'stacked' | 'split'
}

const SectionTitle = ({ children }: { children: string }) => (
  <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ display: 'block', mt: 2 }}>
    {children}
  </Typography>
)

export const CourtDetail = ({ schedule, courts, onSelectCourt, layout = 'stacked' }: CourtDetailProps) => {
  const isSplit = layout === 'split'

  const upcoming = (
    <Box>
      <SectionTitle>{`À venir sur ce terrain (${schedule.upcomingGames.length})`}</SectionTitle>
      {schedule.upcomingGames.length > 0 ? (
        <Stack divider={<Divider flexItem />}>
          {schedule.upcomingGames.map((game) => <GameRow key={game.id} game={game} status="scheduled" showStatusLabel={false} />)}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>Aucun match à venir</Typography>
      )}
    </Box>
  )

  const completed = schedule.completedGames.length > 0 && (
    <Box>
      <SectionTitle>Terminés</SectionTitle>
      <Stack divider={<Divider flexItem />}>
        {schedule.completedGames.map((game) => <GameRow key={game.id} game={game} status="completed" />)}
      </Stack>
    </Box>
  )

  return (
    <Stack>
      <Stack
        direction="row"
        gap={1}
        role="tablist"
        aria-label="Choisir un terrain"
        sx={{ overflowX: 'auto', pb: 1, mb: 1, scrollbarWidth: 'none' }}
      >
        {courts.map((court) => (
          <Chip
            key={court}
            role="tab"
            aria-selected={court === schedule.court}
            label={court}
            color={court === schedule.court ? 'primary' : 'default'}
            variant={court === schedule.court ? 'filled' : 'outlined'}
            onClick={() => onSelectCourt(court)}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isSplit ? { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 1fr)' } : '1fr',
          columnGap: 4,
          alignItems: 'start',
        }}
      >
        <Box>
          <Paper elevation={0} sx={{ bgcolor: 'grey.100', borderRadius: 3, p: 2 }}>
            <LiveGameScore game={schedule.currentGame} size={isSplit ? 'large' : 'regular'} />
          </Paper>
        </Box>
        <Box>
          {upcoming}
          {completed}
        </Box>
      </Box>
    </Stack>
  )
}
