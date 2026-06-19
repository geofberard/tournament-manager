import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import { GameList } from '../../components/shared/GameList'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import type { Team } from '../../services/teamsService'

type TeamGamesViewProps = {
  currentTeam: Team
}

export const TeamGamesView = ({ currentTeam }: TeamGamesViewProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()

  const teamGames = games.filter((game) =>
    Array.from(game.contestants).some((team) => team.id === currentTeam.id),
  )
  const upcomingGames = sortGamesByPosition(
    teamGames.filter((game) => game.status !== GameStatus.Completed),
  )
  const completedGames = sortGamesByPosition(
    teamGames.filter((game) => game.status === GameStatus.Completed),
  )

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Bienvenue {currentTeam.name}</Typography>
        <Typography variant="body1" color="text.secondary">
          Retrouvez ici la liste de vos matchs a venir et deja joues.
        </Typography>
      </Stack>

      {isGamesLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {gamesErrorMessage ? (
        <Alert severity="warning">
          La liste des matchs est indisponible pour le moment.
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
