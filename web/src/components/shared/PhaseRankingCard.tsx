import { Avatar, Box, Card, CardContent, CardHeader, LinearProgress, Stack, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import useSWR from 'swr'
import { getPhaseStatistics } from '../../services/statisticsService'
import type { Phase } from '../../services/phasesService'
import { RankingTable } from './RankingTable'

type PhaseRankingCardProps = {
  phase: Phase
  extended?: boolean
  currentTeamId?: string
}

export const PhaseRankingCard = ({ currentTeamId = '', extended = false, phase }: PhaseRankingCardProps) => {
  const { data, error, isLoading } = useSWR(
    ['/api/phases/statistics', phase.id],
    async () => getPhaseStatistics(phase.id),
  )
  const completionPercent = Math.round((data?.completionRate ?? 0) * 100)

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }} variant="elevation">
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><EmojiEventsIcon /></Avatar>}
        title={
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <Typography fontWeight="bold" variant="h6">{phase.name}</Typography>
            <Stack alignItems="center" direction="row" spacing={0.75} sx={{ minWidth: 92 }}>
              <LinearProgress
                aria-label={`Progression ${phase.name}`}
                color="success"
                value={completionPercent}
                variant={isLoading ? 'indeterminate' : 'determinate'}
                sx={{ borderRadius: 1, flex: 1, height: 6 }}
              />
              <Box sx={{ width: 34, textAlign: 'right' }}>
                <Typography component="span" fontSize={12} fontWeight={700} lineHeight={1}>
                  {isLoading ? '-' : `${completionPercent}%`}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        }
        sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', py: 1.5 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <RankingTable
          currentTeamId={currentTeamId}
          extended={extended}
          errorMessage={error instanceof Error ? error.message : error ? 'Le chargement des resultats a echoue.' : null}
          isLoading={isLoading}
          rankings={data?.teamStats ?? []}
        />
      </CardContent>
    </Card>
  )
}
