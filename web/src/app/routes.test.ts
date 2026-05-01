import { describe, expect, it } from 'vitest'
import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  PUBLIC_HOME_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  teamRoutes,
} from './routes'

describe('routes', () => {
  it('should expose the expected route paths', () => {
    expect(PUBLIC_HOME_PATH).toBe('/public')
    expect(TEAM_HOME_PATH).toBe('/team')
    expect(TEAM_LOGIN_PATH).toBe('/team/login')
    expect(ADMIN_HOME_PATH).toBe('/admin')
    expect(ADMIN_LOGIN_PATH).toBe('/admin/login')
  })

  it('should register the team navigation entries', () => {
    expect(teamRoutes).toEqual([{ label: 'Accueil', path: '/team' }])
  })
})
