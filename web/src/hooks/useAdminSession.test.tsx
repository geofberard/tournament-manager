import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdminSession } from './useAdminSession'
import * as adminAuthService from '../services/adminAuthService'

vi.mock('../services/adminAuthService', () => ({
  getAdminSession: vi.fn(),
  loginAdmin: vi.fn(),
  logoutAdmin: vi.fn(),
}))

const getAdminSessionMock = vi.mocked(adminAuthService.getAdminSession)
const loginAdminMock = vi.mocked(adminAuthService.loginAdmin)
const logoutAdminMock = vi.mocked(adminAuthService.logoutAdmin)

describe('useAdminSession', () => {
  beforeEach(() => {
    getAdminSessionMock.mockResolvedValue({
      authenticated: false,
      username: null,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize from the backend session', async () => {
    const { result } = renderHook(() => useAdminSession())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should update the authenticated state when logging in', async () => {
    loginAdminMock.mockResolvedValue({
      authenticated: true,
      username: 'admin',
    })

    const { result } = renderHook(() => useAdminSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.login({ username: 'admin', password: 'admin123' })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.username).toBe('admin')
  })

  it('should clear the authenticated state when logging out', async () => {
    getAdminSessionMock.mockResolvedValue({
      authenticated: true,
      username: 'admin',
    })
    logoutAdminMock.mockResolvedValue()

    const { result } = renderHook(() => useAdminSession())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.username).toBeNull()
  })
})
