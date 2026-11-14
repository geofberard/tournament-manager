import { cleanup, renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { KIOSK_MODE_STORAGE_KEY, useKioskMode, usePublicLayout } from './usePublicLayout'
import { mockScreenWidth } from '../test/publicFixtures'

const renderWithPath = <T,>(hook: () => T, path: string) =>
  renderHook(hook, {
    wrapper: ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>,
  })

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('usePublicLayout', () => {
  it('should detect large screens', () => {
    mockScreenWidth(true)
    expect(renderHook(() => usePublicLayout()).result.current.isLargeScreen).toBe(true)

    mockScreenWidth(false)
    expect(renderHook(() => usePublicLayout()).result.current.isLargeScreen).toBe(false)
  })
})

describe('useKioskMode', () => {
  it('should be disabled by default', () => {
    expect(renderWithPath(() => useKioskMode(), '/public').result.current).toBe(false)
  })

  it('should be enabled once from the url and remembered', () => {
    expect(renderWithPath(() => useKioskMode(), '/public?borne').result.current).toBe(true)
    expect(localStorage.getItem(KIOSK_MODE_STORAGE_KEY)).toBe('true')

    expect(renderWithPath(() => useKioskMode(), '/public/matchs').result.current).toBe(true)
  })

  it('should be disabled from the url', () => {
    localStorage.setItem(KIOSK_MODE_STORAGE_KEY, 'true')

    expect(renderWithPath(() => useKioskMode(), '/public?borne=off').result.current).toBe(false)
    expect(localStorage.getItem(KIOSK_MODE_STORAGE_KEY)).toBe('false')
  })
})
