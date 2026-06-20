import { Alert, Stack, Typography } from '@mui/material'
import { GameList } from '../shared/GameList'
import { RankingTable } from '../shared/RankingTable'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import { useTeamRankings } from '../../hooks/useTeamRankings'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type TeamResultsContentProps = {
  currentTeam: Team
  selectedPhase: Phase | null
}

export const TeamResultsContent = ({ currentTeam, selectedPhase }: TeamResultsContentProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const isPoolPhase = selectedPhase?.type === 'POOL'
  const {
    groupName,
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useTeamRankings(currentTeam.id, isPoolPhase ? selectedPhase?.id ?? null : null)

  if (!selectedPhase) {
    return <Alert severity="info">Aucune phase n'est disponible pour le moment.</Alert>
  }

  if (isPoolPhase) {
    return (
      <Stack spacing={2}>
        {groupName ? (
          <Typography variant="body1" color="text.secondary">
            {groupName}
          </Typography>
        ) : null}
        <RankingTable
          currentTeamId={currentTeam.id}
          errorMessage={rankingsErrorMessage}
          isLoading={isRankingsLoading}
          rankings={rankings}
        />
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
