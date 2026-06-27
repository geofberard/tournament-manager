import { Avatar, Card, CardContent, CardHeader, Typography } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { usePhaseRankings } from '../../hooks/usePhaseRankings'
import { RankingTable } from './RankingTable'

type PhaseRankingCardProps = {
  currentTeamId?: string
  extended?: boolean
  phaseName: string
  phaseId: string
}

export const PhaseRankingCard = ({ currentTeamId = '', extended = false, phaseName, phaseId }: PhaseRankingCardProps) => {
  const { errorMessage, isLoading, rankings } = usePhaseRankings(phaseId)

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }} variant="elevation">
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><EmojiEventsIcon /></Avatar>}
        title={<Typography fontWeight="bold" variant="h6">{phaseName}</Typography>}
        sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', py: 1.5 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <RankingTable
          currentTeamId={currentTeamId}
          extended={extended}
          errorMessage={errorMessage}
          isLoading={isLoading}
          rankings={rankings}
        />
      </CardContent>
    </Card>
  )
}
