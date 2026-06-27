import { useState, type ReactNode } from 'react'
import { Alert, CircularProgress, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball'
import { GameList } from '../../components/shared/GameList'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { sortGamesByPosition } from '../../services/gameOrdering'
import { getDisplayedGameStatus } from '../../services/gameStatus'
import type { Team } from '../../services/teamsService'

type TeamGamesViewProps = {
  currentTeam: Team
}

type GameSectionHeaderProps = {
  description?: string
  icon?: ReactNode
  title: string
}

const GameSectionHeader = ({ description, icon, title }: GameSectionHeaderProps) => (
  <Stack spacing={0.5}>
    <Stack direction="row" alignItems="center" gap={1}>
      {icon}
      <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Stack>
    {description ? (
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    ) : null}
  </Stack>
)

export const TeamGamesView = ({ currentTeam }: TeamGamesViewProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const [showOnlyTeamGames, setShowOnlyTeamGames] = useState(false)

  const teamGames = games.filter((game) =>
    Array.from(game.contestants).some((team) => team.id === currentTeam.id),
  )
  const teamPhaseIds = new Set(teamGames.map((game) => game.phase.id))
  const phaseGames = games.filter((game) => teamPhaseIds.has(game.phase.id))
  const displayedGames = showOnlyTeamGames
    ? phaseGames.filter((game) => teamGames.includes(game) || game.referee?.id === currentTeam.id)
    : phaseGames
  const displayedStatus = (game: (typeof games)[number]) => getDisplayedGameStatus(game, games)
  const teamOngoingRefereeGames = games.filter((game) =>
    game.referee?.id === currentTeam.id && displayedStatus(game) === 'in_progress',
  )
  const ongoingGames = sortGamesByPosition(
    displayedGames.filter((game) =>
      displayedStatus(game) === 'in_progress' && game.referee?.id !== currentTeam.id,
    ),
  )
  const upcomingGames = sortGamesByPosition(
    displayedGames.filter((game) => displayedStatus(game) === 'scheduled'),
  )
  const completedGames = sortGamesByPosition(
    displayedGames.filter((game) => game.status === GameStatus.Completed),
  )

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'stretch', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Typography variant="h1">Matchs</Typography>

        {!isGamesLoading && !gamesErrorMessage ? (
          <FormControlLabel
            control={(
              <Switch
                checked={showOnlyTeamGames}
                onChange={(event) => setShowOnlyTeamGames(event.target.checked)}
                size="small"
              />
            )}
            label="Mes matchs"
            sx={{ mr: 0 }}
          />
        ) : null}
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

      {teamOngoingRefereeGames.length > 0 ? (<Stack spacing={2}>
        <GameSectionHeader
          description="Vos matchs à arbitrer sur le tournoi. Vous pouvez cliquer sur le bouton d'un match pour accéder à l'interface d'arbitrage."
          icon={<SportsVolleyballIcon color="primary" />}
          title="À arbitrer"
        />
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
          <GameSectionHeader
            description="Les matchs en cours dans vos phases."
            title="En cours"
          />
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
          <GameSectionHeader
            description="Les prochains matchs dans vos phases."
            title="À venir"
          />
          <GameList
            emptyMessage="Aucun match a venir n'est encore planifie pour cette equipe."
            errorMessage={gamesErrorMessage}
            games={upcomingGames}
            allGames={games}
            isLoading={isGamesLoading}
            currentTeam={currentTeam}
            showWaitingGamesCount
          />
        </Stack>
      ) : null}

      {completedGames.length > 0 ? (<Stack spacing={2.5} sx={{ pt: 1 }}>
        <GameSectionHeader title="Terminés" />
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
