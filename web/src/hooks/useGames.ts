import useSWR from 'swr'
import { listGames, type Game } from '../services/gamesService'
import { sortGamesByPosition } from '../services/gameOrdering'

const GAMES_KEY = '/api/games'

const loadGames = async () => sortGamesByPosition(await listGames())

export function useGames() {
  const { data, error, isLoading } = useSWR<Game[]>(GAMES_KEY, loadGames)

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des matchs a echoue.' : null,
    games: data ?? [],
    isLoading,
  }
}
