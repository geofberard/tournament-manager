import { describe, expect, it } from 'vitest'
import {
  adminRoutes,
  ADMIN_GAMES_PATH,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_PHASES_PATH,
  PUBLIC_HOME_PATH,
  TEAM_GAMES_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  TEAM_RESULTS_PATH,
  teamRoutes,
} from './routes'

describe('routes', () => {
  it('should expose the expected route paths', () => {
    expect(PUBLIC_HOME_PATH).toBe('/public')
    expect(TEAM_HOME_PATH).toBe('/team')
    expect(TEAM_RESULTS_PATH).toBe('/team/results')
    expect(TEAM_GAMES_PATH).toBe('/team/games')
    expect(TEAM_LOGIN_PATH).toBe('/team/login')
    expect(ADMIN_HOME_PATH).toBe('/admin')
    expect(ADMIN_GAMES_PATH).toBe('/admin/games')
    expect(ADMIN_LOGIN_PATH).toBe('/admin/login')
    expect(ADMIN_PHASES_PATH).toBe('/admin/phases')
  })

  it('should register the team navigation entries', () => {
    expect(teamRoutes).toEqual([
      { label: 'Resultats', path: '/team/results' },
      { label: 'Matchs', path: '/team/games' },
    ])
  })

  it('should register the admin navigation entries', () => {
    expect(adminRoutes).toEqual([
      { label: 'Accueil', path: '/admin' },
      { label: 'Phases', path: '/admin/phases' },
      { label: 'Matchs', path: '/admin/games' },
    ])
  })
})
