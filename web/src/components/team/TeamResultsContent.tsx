import { Alert, CircularProgress, Stack } from '@mui/material'
import { GameList } from '../shared/GameList'
import { PhaseRankingCard } from '../shared/PhaseRankingCard'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type TeamResultsContentProps = {
  currentTeam: Team
  poolPhases: Phase[]
  selectedPhase: Phase | null
  showAllResults: boolean
}

const teamParticipatesInPhase = (phase: Phase, currentTeam: Team, games: ReturnType<typeof useGames>['games']) =>
  games.some(
    (game) =>
      game.phase.id === phase.id &&
      Array.from(game.contestants).some((contestant) => contestant.id === currentTeam.id),
  )

export const TeamResultsContent = ({
  currentTeam,
  poolPhases,
  selectedPhase,
  showAllResults,
}: TeamResultsContentProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()

  if (!selectedPhase) {
    return <Alert severity="info">Aucune phase n'est disponible pour le moment.</Alert>
  }

  if (poolPhases.length > 0) {
    if (!showAllResults && isGamesLoading) {
      return (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      )
    }

    if (!showAllResults && gamesErrorMessage) {
      return <Alert severity="error">{gamesErrorMessage}</Alert>
    }

    const visiblePoolPhases = showAllResults
      ? poolPhases
      : poolPhases.filter((phase) => teamParticipatesInPhase(phase, currentTeam, games))

    if (visiblePoolPhases.length === 0) {
      return <Alert severity="info">Aucun résultat n'est disponible pour cette équipe dans cette phase.</Alert>
    }

    return (
      <Stack>
        {visiblePoolPhases.map((phase) => (
          <PhaseRankingCard currentTeamId={currentTeam.id} key={phase.id} phaseId={phase.id} phaseName={phase.name} />
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
