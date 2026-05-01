import { Alert, Stack } from '@mui/material'
import type { Game } from '../../services/gamesService'
import { GameCard } from './GameCard'

type GameListProps = {
  emptyMessage?: string
  errorMessage: string | null
  games: Game[]
  isLoading: boolean
}

const defaultEmptyMessage = "Aucun match n'est encore planifie."

export const GameList = ({
  emptyMessage = defaultEmptyMessage,
  errorMessage,
  games,
  isLoading,
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
        <GameCard key={game.id} game={game} />
      ))}
    </Stack>
  )
}
