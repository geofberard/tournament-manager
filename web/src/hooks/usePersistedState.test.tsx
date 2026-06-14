import { renderHook, act } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePersistedState } from './usePersistedState'

describe('usePersistedState', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('should use initialValue when localStorage is empty', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default-value'))

    expect(result.current[0]).toBe('default-value')
  })

  it('should load value from localStorage if it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() => usePersistedState('test-key', 'default-value'))

    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default-value'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(localStorage.getItem('test-key') || '')).toBe('new-value')
  })
})
