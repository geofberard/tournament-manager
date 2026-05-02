import { Alert, Stack, Typography } from '@mui/material'
import { GameList } from '../shared/GameList'
import { RankingTable } from '../shared/RankingTable'
import { useGames } from '../../hooks/useGames'
import { useRankings } from '../../hooks/useRankings'
import type { Game } from '../../services/gamesService'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type TeamResultsContentProps = {
  currentTeam: Team
  selectedPhase: Phase | null
}

const sortGamesChronologically = (games: Game[]) =>
  [...games].sort((leftGame, rightGame) => leftGame.time.getTime() - rightGame.time.getTime())

export const TeamResultsContent = ({ currentTeam, selectedPhase }: TeamResultsContentProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const isPoolPhase = selectedPhase?.type === 'POOL'
  const {
    groupName,
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useRankings(currentTeam.id, isPoolPhase ? selectedPhase?.id ?? null : null)

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

  const teamBracketGames = sortGamesChronologically(
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
      isLoading={isGamesLoading}
    />
  )
}
