import type { Game } from './gamesService'

export const sortGamesByPosition = (games: Game[]) =>
  [...games].sort((leftGame, rightGame) => {
    const positionDiff = (leftGame.position ?? Number.MAX_SAFE_INTEGER) - (rightGame.position ?? Number.MAX_SAFE_INTEGER)
    if (positionDiff !== 0) return positionDiff

    return leftGame.id.localeCompare(rightGame.id)
  })
