import type { Game } from './gamesService'
import { getDisplayedGameStatus } from './gameStatus'
import { sortGamesByPosition } from './gameOrdering'

export const PUBLIC_REFRESH_INTERVAL = 30_000

export type CourtSchedule = {
  court: string
  currentGame: Game | null
  upcomingGames: Game[]
  completedGames: Game[]
}

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

const courtCollator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' })

export const hasValidTime = (game: Game): game is Game & { time: Date } =>
  game.time instanceof Date && !Number.isNaN(game.time.getTime()) && game.time.getTime() > 0

export const formatGameTime = (game: Game): string | null =>
  hasValidTime(game) ? timeFormatter.format(game.time) : null

export const getGameTeams = (game: Game) => Array.from(game.contestants)

export const getTeamPoints = (game: Game, teamId: string): number | null =>
  game.score?.pointsByTeam?.[teamId] ?? null

export const hasScore = (game: Game) =>
  getGameTeams(game).some((team) => getTeamPoints(game, team.id) != null)

export const getWinnerId = (game: Game): string | null => {
  const results = getGameTeams(game).map((team) => ({ teamId: team.id, points: getTeamPoints(game, team.id) }))
  if (results.length < 2 || results.some((result) => result.points == null)) return null

  const [best, second] = [...results].sort((left, right) => (right.points ?? 0) - (left.points ?? 0))
  return best.points === second.points ? null : best.teamId
}

export const sortCourts = (courts: string[]) => [...courts].sort(courtCollator.compare)

export const buildCourtSchedules = (games: Game[], now = new Date()): CourtSchedule[] => {
  const gamesByCourt = new Map<string, Game[]>()

  sortGamesByPosition(games).forEach((game) => {
    const courtGames = gamesByCourt.get(game.court) ?? []
    courtGames.push(game)
    gamesByCourt.set(game.court, courtGames)
  })

  return sortCourts(Array.from(gamesByCourt.keys())).map((court) => {
    const courtGames = gamesByCourt.get(court) ?? []
    const schedule: CourtSchedule = { court, currentGame: null, upcomingGames: [], completedGames: [] }

    courtGames.forEach((game) => {
      const status = getDisplayedGameStatus(game, games, now)

      if (status === 'in_progress') {
        schedule.currentGame = game
      } else if (status === 'completed') {
        schedule.completedGames.unshift(game)
      } else {
        schedule.upcomingGames.push(game)
      }
    })

    return schedule
  })
}
