import { GameStatus } from '../generated/api-client'
import type { Game } from './gamesService'

export type DisplayedGameStatus = 'scheduled' | 'in_progress' | 'completed'

export const countPendingGamesBefore = (game: Game, allGames: Game[]) => {
  if (game.position == null) return undefined
  const targetPosition = game.position

  return allGames.filter((candidate) =>
    candidate.court === game.court &&
    candidate.status !== GameStatus.Completed &&
    candidate.position != null &&
    candidate.position < targetPosition,
  ).length
}

export const getDisplayedGameStatus = (
  game: Game,
  allGames: Game[],
  now = new Date(),
): DisplayedGameStatus => {
  if (game.status === GameStatus.Completed) return 'completed'

  const firstScheduledGameOnCourt = allGames
    .filter((candidate) =>
      candidate.court === game.court && candidate.status === GameStatus.Scheduled,
    )
    .sort((left, right) => {
      const positionDifference =
        (left.position ?? Number.MAX_SAFE_INTEGER) -
        (right.position ?? Number.MAX_SAFE_INTEGER)

      return positionDifference || left.id.localeCompare(right.id)
    })[0]

  const startsInFuture = game.time != null && new Date(game.time).getTime() > now.getTime()

  return firstScheduledGameOnCourt?.id === game.id && !startsInFuture
    ? 'in_progress'
    : 'scheduled'
}
