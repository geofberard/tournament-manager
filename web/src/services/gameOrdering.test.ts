import { describe, expect, it } from 'vitest'
import { GameStatus } from '../generated/api-client'
import type { Game } from './gamesService'
import { sortGamesByPosition } from './gameOrdering'

const game = (id: string, position?: number): Game => ({
  id,
  phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
  group: 'Poule A',
  position,
  time: undefined,
  court: 'Terrain 1',
  status: GameStatus.Scheduled,
  contestants: new Set(),
  referee: undefined,
  score: { pointsByTeam: {} },
})

describe('sortGamesByPosition', () => {
  it('should sort games by absolute position', () => {
    // WHEN
    const result = sortGamesByPosition([game('game-3', 3000), game('game-1', 1000), game('game-2', 2000)])

    // THEN
    expect(result.map(({ id }) => id)).toEqual(['game-1', 'game-2', 'game-3'])
  })

  it('should keep games without position last with a stable id fallback', () => {
    // WHEN
    const result = sortGamesByPosition([game('game-c'), game('game-a'), game('game-b', 1000)])

    // THEN
    expect(result.map(({ id }) => id)).toEqual(['game-b', 'game-a', 'game-c'])
  })
})
