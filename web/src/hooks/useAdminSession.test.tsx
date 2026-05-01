import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAdminSession } from './useAdminSession'

describe('useAdminSession', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should initialize as unauthenticated by default', () => {
    const { result } = renderHook(() => useAdminSession())

    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should persist the authenticated state when logging in', () => {
    const { result } = renderHook(() => useAdminSession())

    act(() => {
      result.current.login()
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(window.localStorage.getItem('admin_authenticated')).toBe('true')
  })

  it('should clear the authenticated state when logging out', () => {
    const { result } = renderHook(() => useAdminSession())

    act(() => {
      result.current.login()
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(window.localStorage.getItem('admin_authenticated')).toBeNull()
  })
})
