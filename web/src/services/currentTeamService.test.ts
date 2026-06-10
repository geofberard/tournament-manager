import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearCurrentTeam, getCurrentTeam, setCurrentTeam } from './currentTeamService'
import type { Team } from './teamsService'

const team: Team = { id: 'team-2', name: 'Tigers' }

describe('currentTeamService', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.cookie = 'team=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  })

  afterEach(() => {
    window.localStorage.clear()
    document.cookie = 'team=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
  })

  it('should return the current team from local storage first', () => {
    // GIVEN
    window.localStorage.setItem('team', JSON.stringify(team))
    document.cookie = `team=${JSON.stringify({ id: 'other', name: 'Other' })};path=/`

    // WHEN
    const currentTeam = getCurrentTeam()

    // THEN
    expect(currentTeam).toEqual(team)
  })

  it('should migrate the current team from the legacy cookie when local storage is empty', () => {
    // GIVEN
    document.cookie = `team=${JSON.stringify(team)};path=/`

    // WHEN
    const currentTeam = getCurrentTeam()

    // THEN
    expect(currentTeam).toEqual(team)
    expect(window.localStorage.getItem('team')).toBe(JSON.stringify(team))
  })

  it('should return null when local storage contains invalid JSON', () => {
    // GIVEN
    window.localStorage.setItem('team', '{invalid-json')

    // WHEN
    const currentTeam = getCurrentTeam()

    // THEN
    expect(currentTeam).toBeNull()
  })

  it('should return null when the legacy cookie contains invalid JSON', () => {
    // GIVEN
    document.cookie = 'team={invalid-json;path=/'

    // WHEN
    const currentTeam = getCurrentTeam()

    // THEN
    expect(currentTeam).toBeNull()
  })

  it('should persist the current team in local storage and cookie', () => {
    // GIVEN

    // WHEN
    setCurrentTeam(team)

    // THEN
    expect(window.localStorage.getItem('team')).toBe(JSON.stringify(team))
    expect(document.cookie).toContain('team=')
    expect(decodeURIComponent(document.cookie)).toContain(JSON.stringify(team))
  })

  it('should clear the current team from local storage and cookie', () => {
    // GIVEN
    setCurrentTeam(team)

    // WHEN
    clearCurrentTeam()

    // THEN
    expect(window.localStorage.getItem('team')).toBeNull()
    expect(getCurrentTeam()).toBeNull()
    expect(decodeURIComponent(document.cookie)).not.toContain(JSON.stringify(team))
  })
})
