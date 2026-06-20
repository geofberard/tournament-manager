import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import { GameList } from '../../components/shared/GameList'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import { getDisplayedGameStatus } from '../../services/gameStatus'
import type { Team } from '../../services/teamsService'
import SportsIcon from '@mui/icons-material/Sports';

type TeamGamesViewProps = {
  currentTeam: Team
}

export const TeamGamesView = ({ currentTeam }: TeamGamesViewProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()

  const teamGames = games.filter((game) =>
    Array.from(game.contestants).some((team) => team.id === currentTeam.id),
  )
  const displayedStatus = (game: (typeof games)[number]) => getDisplayedGameStatus(game, games)
  const teamOngoingRefereeGames = games.filter((game) =>
    game.referee?.id === currentTeam.id && displayedStatus(game) === 'in_progress',
  )
  const teamUpcomingRefereeGames = games.filter((game) =>
    game.referee?.id === currentTeam.id && displayedStatus(game) === 'scheduled',
  )
  const ongoingGames = sortGamesByPosition(
    teamGames.filter((game) => displayedStatus(game) === 'in_progress'),
  )
  const upcomingGames = sortGamesByPosition(
    [...teamGames.filter((game) => displayedStatus(game) === 'scheduled'), ...teamUpcomingRefereeGames],
  )
  const completedGames = sortGamesByPosition(
    teamGames.filter((game) => game.status === GameStatus.Completed),
  )

  return (
    <Stack spacing={3}>

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

      {teamOngoingRefereeGames.length > 0 ? (<Stack spacing={2}>
        <Stack spacing={0.5} direction="row" alignItems="center" justifyContent="center">
          <SportsIcon />
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
            Matchs à arbitrer
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Vos matchs à arbitrer sur le tournoi. Vous pouvez cliquer sur le bouton d'un match pour accéder à l'interface d'arbitrage.
        </Typography>
        <GameList
          emptyMessage="Aucun match à arbitrer n'est enregistré pour cette equipe."
          errorMessage={gamesErrorMessage}
          games={teamOngoingRefereeGames}
          allGames={games}
          isLoading={isGamesLoading}
          currentTeam={currentTeam}
        />
      </Stack>
      ) : null}

      {ongoingGames.length > 0 ? (
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
              Matchs en cours
            </Typography>
            <Typography variant="body2" color="text.secondary">
              C'est l'heure de jouer ! Dirigez-vous vers le terrain pour disputer votre match.
            </Typography>
          </Stack>
          <GameList
            emptyMessage="Aucun match en cours n'est enregistré pour cette equipe."
            errorMessage={gamesErrorMessage}
            games={ongoingGames}
            allGames={games}
            isLoading={isGamesLoading}
            currentTeam={currentTeam}
          />
        </Stack>
      ) : null}

      {upcomingGames.length > 0 ? (
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
            allGames={games}
            isLoading={isGamesLoading}
            currentTeam={currentTeam}
          />
        </Stack>
      ) : null}

      {completedGames.length > 0 ? (<Stack spacing={2.5} sx={{ pt: 1 }}>
        <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
          Matchs terminés
        </Typography>
        <GameList
          emptyMessage="Aucun match termine pour cette equipe."
          errorMessage={gamesErrorMessage}
          games={completedGames}
          allGames={games}
          isLoading={isGamesLoading}
          currentTeam={currentTeam}
        />
      </Stack>
      ) : null}
    </Stack>
  )
}
