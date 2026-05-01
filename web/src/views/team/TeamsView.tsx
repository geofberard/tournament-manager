import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import { GameList } from '../../components/shared/GameList'
import { RankingTable } from '../../components/shared/RankingTable'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { useRankings } from '../../hooks/useRankings'
import type { Game } from '../../services/gamesService'
import type { Team } from '../../services/teamsService'

type TeamsViewProps = {
  currentTeam: Team
}

export const TeamsView = ({ currentTeam }: TeamsViewProps) => {
  return <TeamRankingsView currentTeam={currentTeam} />
}

const TeamIntro = ({
  currentTeam,
  description,
}: {
  currentTeam: Team
  description: string
}) => (
  <Stack spacing={0.5}>
    <Typography variant="h2">Bienvenue {currentTeam.name}</Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Stack>
)

const sortGamesChronologically = (games: Game[]) =>
  [...games].sort((leftGame, rightGame) => leftGame.time.getTime() - rightGame.time.getTime())

export const TeamRankingsView = ({ currentTeam }: TeamsViewProps) => {
  const { errorMessage: gamesErrorMessage } = useGames()
  const {
    poolName,
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useRankings(currentTeam.id)

  const hasGlobalError = gamesErrorMessage && rankingsErrorMessage

  return (
    <Stack spacing={3}>
      <TeamIntro
        currentTeam={currentTeam}
        description="Retrouvez ici les resultats de votre poule et suivez votre position."
      />

      {isRankingsLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {hasGlobalError ? <Alert severity="warning">La liste des matchs est indisponible pour le moment.</Alert> : null}

      <Stack spacing={2}>
        <Typography variant="h3">Resultat</Typography>
        {poolName ? (
          <Typography variant="body1" color="text.secondary">
            {poolName}
          </Typography>
        ) : null}
        <RankingTable
          currentTeamId={currentTeam.id}
          errorMessage={rankingsErrorMessage}
          isLoading={isRankingsLoading}
          rankings={rankings}
        />
      </Stack>
    </Stack>
  )
}

export const TeamGamesView = ({ currentTeam }: TeamsViewProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const {
    errorMessage: rankingsErrorMessage,
  } = useRankings(currentTeam.id)

  const teamGames = games.filter((game) =>
    Array.from(game.contestants).some((team) => team.id === currentTeam.id),
  )
  const upcomingGames = sortGamesChronologically(
    teamGames.filter((game) => game.status !== GameStatus.Completed),
  )
  const completedGames = sortGamesChronologically(
    teamGames.filter((game) => game.status === GameStatus.Completed),
  )

  const hasGlobalError = gamesErrorMessage && rankingsErrorMessage

  return (
    <Stack spacing={3}>
      <TeamIntro
        currentTeam={currentTeam}
        description="Retrouvez ici la liste de vos matchs a venir et deja joues."
      />

      {isGamesLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {hasGlobalError ? (
        <Alert severity="warning">
          Le classement est indisponible pour le moment.
        </Alert>
      ) : null}

      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
            Prochains matchs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vos prochains rendez-vous sur le tournoi.
          </Typography>
        </Stack>
        <GameList
          emptyMessage="Aucun match a venir n'est encore planifie pour cette equipe."
          errorMessage={gamesErrorMessage}
          games={upcomingGames}
          isLoading={isGamesLoading}
        />
      </Stack>

      <Stack spacing={2.5} sx={{ pt: 1 }}>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
          Matchs terminés
        </Typography>
        <GameList
          emptyMessage="Aucun match termine pour cette equipe."
          errorMessage={gamesErrorMessage}
          games={completedGames}
          isLoading={isGamesLoading}
        />
      </Stack>
    </Stack>
  )
}
