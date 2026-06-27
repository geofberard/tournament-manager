import { Alert, Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import { GameList } from '../shared/GameList'
import { RankingTable } from '../shared/RankingTable'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import { useTeamRankings } from '../../hooks/useTeamRankings'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type TeamResultsContentProps = {
  currentTeam: Team
  poolPhases: Phase[]
  selectedPhase: Phase | null
}

const TeamPoolRankingCard = ({ currentTeam, phase }: { currentTeam: Team, phase: Phase }) => {
  const {
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useTeamRankings(currentTeam.id, phase.id)

  return (
    <Card variant="outlined">
      <CardHeader title={<Typography fontWeight="bold">{phase.name}</Typography>} />
      <CardContent sx={{ pt: 0 }}>
        <RankingTable
          currentTeamId={currentTeam.id}
          errorMessage={rankingsErrorMessage}
          isLoading={isRankingsLoading}
          rankings={rankings}
        />
      </CardContent>
    </Card>
  )
}

export const TeamResultsContent = ({ currentTeam, poolPhases, selectedPhase }: TeamResultsContentProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()

  if (!selectedPhase) {
    return <Alert severity="info">Aucune phase n'est disponible pour le moment.</Alert>
  }

  if (poolPhases.length > 0) {
    return (
      <Stack spacing={2}>
        {poolPhases.map((phase) => (
          <TeamPoolRankingCard currentTeam={currentTeam} key={phase.id} phase={phase} />
        ))}
      </Stack>
    )
  }

  const teamBracketGames = sortGamesByPosition(
    games.filter(
      (game) =>
        game.phase.id === selectedPhase.id &&
        Array.from(game.contestants).some((team) => team.id === currentTeam.id),
    ),
  )

  return (
    <GameList
      emptyMessage="Aucun match de bracket n'est encore planifie pour cette equipe."
      errorMessage={gamesErrorMessage}
      games={teamBracketGames}
      allGames={games}
      isLoading={isGamesLoading}
      currentTeam={currentTeam}
    />
  )
}
