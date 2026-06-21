import { Card, CardContent, CardHeader, Typography, Avatar } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { RankingTable } from './RankingTable'
import { useGroupRankings } from '../../hooks/useGroupRankings'

type GroupRankingCardProps = {
  extended?: boolean
  groupId: string
  phaseId: string
}

export const GroupRankingCard = ({ extended = false, groupId, phaseId }: GroupRankingCardProps) => {
  const { errorMessage, isLoading, rankings } = useGroupRankings(groupId, phaseId)

  return (
    <Card variant="elevation" elevation={2} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <EmojiEventsIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" fontWeight="bold">
            Groupe {groupId}
          </Typography>
        }
        sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', py: 1.5 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <RankingTable
          currentTeamId=""
          extended={extended}
          errorMessage={errorMessage}
          isLoading={isLoading}
          rankings={rankings}
        />
      </CardContent>
    </Card>
  )
}
