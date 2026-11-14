import type { Game } from '../services/gamesService'

type GameOverrides = Partial<Omit<Game, 'contestants'>> & {
  teams?: [string, string]
  points?: [number, number]
}

export const buildGame = ({ teams = ['Aigles', 'Lions'], points, ...overrides }: GameOverrides = {}): Game => {
  const contestants = teams.map((name) => ({ id: `team-${name}`, name }))

  return {
    id: overrides.id ?? `game-${teams.join('-')}`,
    position: 1,
    court: 'Terrain 1',
    status: 'scheduled',
    time: new Date('2020-06-18T10:00:00Z'),
    phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 },
    contestants: new Set(contestants),
    score: {
      pointsByTeam: points
        ? { [contestants[0].id]: points[0], [contestants[1].id]: points[1] }
        : {},
    },
    ...overrides,
  }
}

export const mockScreenWidth = (isLargeScreen: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isLargeScreen && query.includes('min-width'),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}
