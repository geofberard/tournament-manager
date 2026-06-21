import { Alert, Stack } from '@mui/material'
import type { Game } from '../../services/gamesService'
import { GameCard } from './GameCard'
import type { Team } from '../../generated/api-client'
import { countPendingGamesBefore, getDisplayedGameStatus } from '../../services/gameStatus'

type GameListProps = {
  emptyMessage?: string
  errorMessage: string | null
  games: Game[]
  allGames: Game[]
  isLoading: boolean,
  currentTeam: Team
  showWaitingGamesCount?: boolean
}

const defaultEmptyMessage = "Aucun match n'est encore planifie."

export const GameList = ({
  emptyMessage = defaultEmptyMessage,
  errorMessage,
  games,
  allGames,
  isLoading,
  currentTeam,
  showWaitingGamesCount = false,
}: GameListProps) => {
  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  if (!isLoading && games.length === 0) {
    return <Alert severity="info">{emptyMessage}</Alert>
  }

  return (
    <Stack spacing={2}>
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          currentTeam={currentTeam}
          displayedStatus={getDisplayedGameStatus(game, allGames)}
          waitingGamesCount={showWaitingGamesCount ? countPendingGamesBefore(game, allGames) : undefined}
        />
      ))}
    </Stack>
  )
}
