import type { Game } from "../services/apiClient"

export function useLocalStorage() {

  const setItem = (key: string, value: string) => {
    globalThis.localStorage.setItem(
      key,
      value,
    )
  }

  const getItem = (key: string) => {
    return globalThis.localStorage.getItem(key)
  }

  const setLocalGameState = (game: Game, scores: Record<string, number>, lastTeamPoint: string | null) => {
    const key = `tournament-game-state-${game.id}`

    globalThis.localStorage.setItem(
      key,
      JSON.stringify({ scores, lastTeamPoint }),
    )
  }

  const getLocalGameState = (game: Game) => {
    const key = `tournament-game-state-${game.id}`

    return globalThis.localStorage.getItem(key)
  }

  const setLocalSwitchSides = (game: Game, switchSides: boolean) => {
    const key = `tournament-game-switch-sides-${game.id}`

    globalThis.localStorage.setItem(
      key,
      JSON.stringify({ switchSides }),
    )
  }

  const getLocalSwitchSides = (game: Game) => {
    const key = `tournament-game-switch-sides-${game.id}`

    return globalThis.localStorage.getItem(key)
  }

  return {
    getItem,
    setItem,
    setLocalGameState,
    getLocalGameState,
    setLocalSwitchSides,
    getLocalSwitchSides
  }
}