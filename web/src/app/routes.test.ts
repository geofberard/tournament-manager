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
    // GIVEN
    const expectedPaths = [
      '/public',
      '/team',
      '/team/results',
      '/team/games',
      '/team/login',
      '/admin',
      '/admin/phases',
      '/admin/games',
      '/admin/login',
    ]

    // WHEN
    const paths = [
      PUBLIC_HOME_PATH,
      TEAM_HOME_PATH,
      TEAM_RESULTS_PATH,
      TEAM_GAMES_PATH,
      TEAM_LOGIN_PATH,
      ADMIN_HOME_PATH,
      ADMIN_PHASES_PATH,
      ADMIN_GAMES_PATH,
      ADMIN_LOGIN_PATH,
    ]

    // THEN
    expect(paths).toEqual(expectedPaths)
  })

  it('should register the team navigation entries', () => {
    // GIVEN
    const expectedRoutes = [
      { label: 'Resultats', path: '/team/results' },
      { label: 'Matchs', path: '/team/games' },
    ]

    // WHEN
    const routes = teamRoutes

    // THEN
    expect(routes).toEqual(expectedRoutes)
  })

  it('should register the admin navigation entries', () => {
    // GIVEN
    const expectedRoutes = [
      { label: 'Accueil', path: '/admin' },
      { label: 'Phases', path: '/admin/phases' },
      { label: 'Matchs', path: '/admin/games' },
    ]

    // WHEN
    const routes = adminRoutes

    // THEN
    expect(routes).toEqual(expectedRoutes)
  })
})
