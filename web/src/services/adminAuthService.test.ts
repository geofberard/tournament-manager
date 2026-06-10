import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResponseError } from '../generated/api-client/runtime'
import { getAdminSession, loginAdmin, logoutAdmin } from './adminAuthService'
import { adminAuthApi } from './apiClient'

vi.mock('./apiClient', () => ({
  adminAuthApi: {
    getAdminSession: vi.fn(),
    loginAdmin: vi.fn(),
    logoutAdmin: vi.fn(),
  },
}))

const adminAuthApiMock = vi.mocked(adminAuthApi)

describe('adminAuthService', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch the current admin session', async () => {
    // GIVEN
    adminAuthApiMock.getAdminSession.mockResolvedValue({
      authenticated: true,
      username: 'admin',
    })

    // WHEN
    const sessionPromise = getAdminSession()

    // THEN
    await expect(sessionPromise).resolves.toEqual({
      authenticated: true,
      username: 'admin',
    })
  })

  it('should reject invalid credentials during login', async () => {
    // GIVEN
    adminAuthApiMock.loginAdmin.mockRejectedValue(new ResponseError(new Response(null, { status: 401 })))

    // WHEN
    const loginPromise = loginAdmin({ username: 'admin', password: 'wrong' })

    // THEN
    await expect(loginPromise).rejects.toThrow('Identifiants invalides.')
  })

  it('should call the logout endpoint', async () => {
    // GIVEN
    adminAuthApiMock.logoutAdmin.mockResolvedValue(undefined)

    // WHEN
    const logoutPromise = logoutAdmin()

    // THEN
    await expect(logoutPromise).resolves.toBeUndefined()
    expect(adminAuthApiMock.logoutAdmin).toHaveBeenCalledOnce()
  })
})
