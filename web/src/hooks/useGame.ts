import useSWR from 'swr'
import { getGameById, type Game } from '../services/gamesService'

const GAME_KEY = (gameId: string) => `/api/games/${gameId}`

export function useGame(gameId?: string) {
  const shouldFetch = Boolean(gameId)

  const { data, error, isLoading } = useSWR<Game | null>(
    shouldFetch ? GAME_KEY(gameId!) : null,
    () => getGameById(gameId!),
  )

  return {
    game: data ?? null,
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement du match a échoué.' : null,
    isLoading: Boolean(isLoading),
  }
}
