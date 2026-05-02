import { Alert, CircularProgress, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { GameList } from '../../components/shared/GameList'
import { RankingTable } from '../../components/shared/RankingTable'
import { GameStatus } from '../../generated/api-client'
import { useGames } from '../../hooks/useGames'
import { usePhases } from '../../hooks/usePhases'
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
  const { errorMessage: gamesErrorMessage, games } = useGames()
  const { errorMessage: phasesErrorMessage, isLoading: isPhasesLoading, phases } = usePhases()
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPhaseId && phases.length > 0) {
      setSelectedPhaseId(phases[0].id)
    }
  }, [phases, selectedPhaseId])

  const selectedPhase = phases.find((phase) => phase.id === selectedPhaseId) ?? null
  const isPoolPhase = selectedPhase?.type === 'POOL'
  const {
    groupName,
    errorMessage: rankingsErrorMessage,
    isLoading: isRankingsLoading,
    rankings,
  } = useRankings(currentTeam.id, isPoolPhase ? selectedPhaseId : null)

  const teamBracketGames = sortGamesChronologically(
    games.filter(
      (game) =>
        game.phase.id === selectedPhaseId &&
        Array.from(game.contestants).some((team) => team.id === currentTeam.id),
    ),
  )

  const hasGlobalError = isPoolPhase
    ? gamesErrorMessage && (rankingsErrorMessage || phasesErrorMessage)
    : phasesErrorMessage && gamesErrorMessage
  const isLoading = isPhasesLoading || (isPoolPhase ? isRankingsLoading : false)

  return (
    <Stack spacing={3}>
      <TeamIntro
        currentTeam={currentTeam}
        description="Retrouvez ici les resultats de votre groupe et suivez votre position."
      />

      {isLoading ? (
        <Stack direction="row" justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Stack>
      ) : null}

      {hasGlobalError ? <Alert severity="warning">La liste des matchs est indisponible pour le moment.</Alert> : null}

      <Stack spacing={2}>
        <Typography variant="h3">Resultat</Typography>
        {phases.length > 0 ? (
          <Tabs
            value={selectedPhaseId ?? false}
            onChange={(_event, value: string) => setSelectedPhaseId(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Phases du tournoi"
          >
            {phases.map((phase) => (
              <Tab key={phase.id} value={phase.id} label={phase.name} />
            ))}
          </Tabs>
        ) : null}
        {selectedPhase ? (
          <Typography variant="body2" color="text.secondary">
            Phase active: {selectedPhase.name}
          </Typography>
        ) : null}
        {isPoolPhase && groupName ? (
          <Typography variant="body1" color="text.secondary">
            {groupName}
          </Typography>
        ) : null}
        {isPoolPhase ? (
          <RankingTable
            currentTeamId={currentTeam.id}
            errorMessage={phasesErrorMessage ?? rankingsErrorMessage}
            isLoading={isLoading}
            rankings={rankings}
          />
        ) : (
          <GameList
            emptyMessage="Aucun match de bracket n'est encore planifie pour cette equipe."
            errorMessage={phasesErrorMessage ?? gamesErrorMessage}
            games={teamBracketGames}
            isLoading={isPhasesLoading}
          />
        )}
      </Stack>
    </Stack>
  )
}

export const TeamGamesView = ({ currentTeam }: TeamsViewProps) => {
  const { errorMessage: gamesErrorMessage, games, isLoading: isGamesLoading } = useGames()
  const { phases } = usePhases()
  const {
    errorMessage: rankingsErrorMessage,
  } = useRankings(currentTeam.id, phases[0]?.id ?? null)

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
