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
    adminAuthApiMock.getAdminSession.mockResolvedValue({
      authenticated: true,
      username: 'admin',
    })

    await expect(getAdminSession()).resolves.toEqual({
      authenticated: true,
      username: 'admin',
    })
  })

  it('should reject invalid credentials during login', async () => {
    adminAuthApiMock.loginAdmin.mockRejectedValue(new ResponseError(new Response(null, { status: 401 })))

    await expect(loginAdmin({ username: 'admin', password: 'wrong' })).rejects.toThrow('Identifiants invalides.')
  })

  it('should call the logout endpoint', async () => {
    adminAuthApiMock.logoutAdmin.mockResolvedValue(undefined)

    await expect(logoutAdmin()).resolves.toBeUndefined()
    expect(adminAuthApiMock.logoutAdmin).toHaveBeenCalledOnce()
  })
})
