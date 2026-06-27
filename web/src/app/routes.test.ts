import { describe, expect, it } from 'vitest'
import {
  adminRoutes,
  ADMIN_GAMES_PATH,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_PHASES_PATH,
  ADMIN_TEAMS_PATH,
  ADMIN_COURTS_PATH,
  ADMIN_RESULTS_PATH,
  PUBLIC_HOME_PATH,
  TEAM_GAMES_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  TEAM_RESULTS_PATH,
  TEAM_TERRAINS_PATH,
  TEAM_BUVETTE_PATH,
  TEAM_REFEREE_GAME_PATH,
  teamRoutes,
} from './routes'

describe('routes', () => {
  it('should expose the expected route paths', () => {
    expect(PUBLIC_HOME_PATH).toBe('/public')
    expect(TEAM_HOME_PATH).toBe('/team')
    expect(TEAM_RESULTS_PATH).toBe('/team/results')
    expect(TEAM_GAMES_PATH).toBe('/team/games')
    expect(TEAM_TERRAINS_PATH).toBe('/team/terrains')
    expect(TEAM_BUVETTE_PATH).toBe('/team/buvette')
    expect(TEAM_LOGIN_PATH).toBe('/team/login')
    expect(ADMIN_HOME_PATH).toBe('/admin')
    expect(ADMIN_GAMES_PATH).toBe('/admin/games')
    expect(ADMIN_TEAMS_PATH).toBe('/admin/teams')
    expect(ADMIN_LOGIN_PATH).toBe('/admin/login')
    expect(ADMIN_PHASES_PATH).toBe('/admin/phases')
    expect(ADMIN_COURTS_PATH).toBe('/admin/courts')
    expect(ADMIN_RESULTS_PATH).toBe('/admin/results')
    expect(TEAM_REFEREE_GAME_PATH).toBe('/team/referee/game/:id')
  })

  it('should register the team navigation entries', () => {
    // GIVEN
    const expectedRoutes = [
      { label: 'Resultats', path: '/team/results' },
      { label: 'Matchs', path: '/team/games' },
      { label: 'Terrains', path: '/team/terrains' },
      { label: 'Buvette', path: '/team/buvette' },
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
      { label: 'Equipes', path: '/admin/teams' },
      { label: 'Matchs', path: '/admin/games' },
      { label: 'Terrains', path: '/admin/courts' },
      { label: 'Classement', path: '/admin/results' },
    ]

    // WHEN
    const routes = adminRoutes

    // THEN
    expect(routes).toEqual(expectedRoutes)
  })
})
