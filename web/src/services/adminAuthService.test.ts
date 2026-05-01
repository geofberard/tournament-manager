import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  clearAdminAuthenticated,
  isAdminAuthenticated,
  setAdminAuthenticated,
} from './adminAuthService'

describe('adminAuthService', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('should return false by default', () => {
    expect(isAdminAuthenticated()).toBe(false)
  })

  it('should persist the admin authentication flag', () => {
    setAdminAuthenticated()

    expect(isAdminAuthenticated()).toBe(true)
  })

  it('should clear the admin authentication flag', () => {
    setAdminAuthenticated()

    clearAdminAuthenticated()

    expect(isAdminAuthenticated()).toBe(false)
  })
})
