import { describe, expect, it } from 'vitest'
import { GameStatus, type Game } from '../generated/api-client'
import { getDisplayedGameStatus } from './gameStatus'

const now = new Date('2026-06-20T12:00:00Z')
const game = (overrides: Partial<Game>): Game => ({
  id: 'game-1',
  phase: { id: 'phase-1', name: 'Phase 1', order: 1, type: 'POOL' },
  group: 'A',
  court: 'Court 1',
  position: 1,
  status: GameStatus.Scheduled,
  contestants: new Set(),
  score: { pointsByTeam: {} },
  ...overrides,
})

describe('gameStatus', () => {
  it('displays the first scheduled game on each court as in progress', () => {
    const first = game({ id: 'first', position: 10 })
    const next = game({ id: 'next', position: 20 })
    const otherCourt = game({ id: 'other', court: 'Court 2', position: 30 })
    const allGames = [next, otherCourt, first]

    expect(getDisplayedGameStatus(first, allGames, now)).toBe('in_progress')
    expect(getDisplayedGameStatus(next, allGames, now)).toBe('scheduled')
    expect(getDisplayedGameStatus(otherCourt, allGames, now)).toBe('in_progress')
  })

  it('ignores completed games when selecting the first scheduled game', () => {
    const completed = game({ id: 'completed', position: 1, status: GameStatus.Completed })
    const scheduled = game({ id: 'scheduled', position: 2 })

    expect(getDisplayedGameStatus(completed, [completed, scheduled], now)).toBe('completed')
    expect(getDisplayedGameStatus(scheduled, [completed, scheduled], now)).toBe('in_progress')
  })

  it('keeps the first game scheduled when it starts in the future', () => {
    const futureGame = game({ time: new Date('2026-06-20T13:00:00Z') })

    expect(getDisplayedGameStatus(futureGame, [futureGame], now)).toBe('scheduled')
  })
})
