import { describe, expect, it } from 'vitest'
import { buildGame } from '../test/publicFixtures'
import { buildCourtSchedules, formatGameTime, getTeamPoints, getWinnerId, hasScore, hasValidTime, sortCourts } from './courtSchedule'

const now = new Date('2026-06-18T12:00:00Z')

describe('buildCourtSchedules', () => {
  it('should split games of each court into current, upcoming and completed games', () => {
    // GIVEN
    const games = [
      buildGame({ id: 'done-1', position: 1, status: 'completed' }),
      buildGame({ id: 'done-2', position: 2, status: 'completed' }),
      buildGame({ id: 'live', position: 3 }),
      buildGame({ id: 'next-2', position: 5 }),
      buildGame({ id: 'next-1', position: 4 }),
    ]

    // WHEN
    const [schedule] = buildCourtSchedules(games, now)

    // THEN
    expect(schedule.court).toBe('Terrain 1')
    expect(schedule.currentGame?.id).toBe('live')
    expect(schedule.upcomingGames.map((game) => game.id)).toEqual(['next-1', 'next-2'])
    expect(schedule.completedGames.map((game) => game.id)).toEqual(['done-2', 'done-1'])
  })

  it('should not mark a game as current before its start time', () => {
    const games = [buildGame({ id: 'later', time: new Date('2026-06-18T14:00:00Z') })]

    const [schedule] = buildCourtSchedules(games, now)

    expect(schedule.currentGame).toBeNull()
    expect(schedule.upcomingGames.map((game) => game.id)).toEqual(['later'])
  })

  it('should sort courts naturally', () => {
    const games = [
      buildGame({ id: 'a', court: 'Terrain 10' }),
      buildGame({ id: 'b', court: 'Terrain 2' }),
      buildGame({ id: 'c', court: 'Terrain 1' }),
    ]

    expect(buildCourtSchedules(games, now).map((schedule) => schedule.court)).toEqual(['Terrain 1', 'Terrain 2', 'Terrain 10'])
  })
})

describe('court schedule helpers', () => {
  it('should sort court names naturally', () => {
    expect(sortCourts(['T10', 'T2', 'T1'])).toEqual(['T1', 'T2', 'T10'])
  })

  it('should only format valid times', () => {
    expect(hasValidTime(buildGame({ time: new Date(0) }))).toBe(false)
    expect(formatGameTime(buildGame({ time: undefined }))).toBeNull()
    expect(formatGameTime(buildGame({ time: new Date(2026, 5, 18, 14, 30) }))).toBe('14:30')
  })

  it('should read team points and detect scores', () => {
    const game = buildGame({ teams: ['Aigles', 'Lions'], points: [21, 18] })

    expect(getTeamPoints(game, 'team-Aigles')).toBe(21)
    expect(getTeamPoints(game, 'unknown')).toBeNull()
    expect(hasScore(game)).toBe(true)
    expect(hasScore(buildGame())).toBe(false)
  })

  it('should find the winner of a game', () => {
    expect(getWinnerId(buildGame({ teams: ['Aigles', 'Lions'], points: [25, 21] }))).toBe('team-Aigles')
    expect(getWinnerId(buildGame({ teams: ['Aigles', 'Lions'], points: [18, 25] }))).toBe('team-Lions')
    expect(getWinnerId(buildGame({ points: [20, 20] }))).toBeNull()
    expect(getWinnerId(buildGame())).toBeNull()
  })
})
