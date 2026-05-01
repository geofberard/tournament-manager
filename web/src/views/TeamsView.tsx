import { Alert, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { RankingTable } from '../components/team-home/RankingTable'
import { TeamMatchesCard } from '../components/team-home/TeamMatchesCard'
import { useGames } from '../hooks/useGames'
import { useRankings } from '../hooks/useRankings'
import type { Team } from '../services/teamsService'

type TeamsViewProps = {
  currentTeam: Team
}

export function TeamsView({ currentTeam }: TeamsViewProps) {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const {
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useRankings()

  const teamGames = games.filter((game) =>
    Array.from(game.contestants).some((team) => team.id === currentTeam.id),
  )

  const isLoading = isGamesLoading || isRankingsLoading

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h2">Bienvenue {currentTeam.name}</Typography>
        <Typography variant="body1" color="text.secondary">
          Retrouvez ici le classement du tournoi et vos prochains matchs.
        </Typography>
      </Stack>

      {isLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {!isLoading && gamesErrorMessage && rankingsErrorMessage ? (
        <Alert severity="error">
          Impossible de charger les informations de l'équipe pour le moment.
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={2}>
            <Typography variant="h3">Classement</Typography>
            <RankingTable
              currentTeamId={currentTeam.id}
              errorMessage={rankingsErrorMessage}
              isLoading={isRankingsLoading}
              rankings={rankings}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={2}>
            <Typography variant="h3">Vos matchs</Typography>
            <TeamMatchesCard
              errorMessage={gamesErrorMessage}
              games={teamGames}
              isLoading={isGamesLoading}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  )
}
