import useSWR from 'swr'
import { listGames, getGameById, type Game } from '../services/gamesService'

const GAMES_KEY = '/api/games'
const GAME_KEY = (gameId: string) => `/api/games/${gameId}`

const sortGamesByTime = (games: Game[]) =>
  [...games].sort((gameA, gameB) => gameA.time.getTime() - gameB.time.getTime())

const loadGames = async () => sortGamesByTime(await listGames())

export function useGames() {
  const { data, error, isLoading } = useSWR<Game[]>(GAMES_KEY, loadGames)

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des matchs a echoue.' : null,
    games: data ?? [],
    isLoading,
  }
}

export function useGame(gameId?: string) {
  const { data, error, isLoading } = useSWR<Game | null>(
    gameId ? GAME_KEY(gameId) : null,
    () => getGameById(gameId!),
  )

  return {
    game: data ?? null,
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement du match a échoué.' : null,
    isLoading,
  }
}
