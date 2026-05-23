import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'
import type { Game } from '../services/apiClient'

describe('useLocalStorage', () => {
  const game: Game = { id: 'game-1' } as Game

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('should set and get a local storage item', () => {
    const { setItem, getItem } = useLocalStorage()

    setItem('test-key', 'test-value')

    expect(getItem('test-key')).toBe('test-value')
  })

  it('should store and retrieve game state for a game', () => {
    const { setLocalGameState, getLocalGameState } = useLocalStorage()
    const state = { scores: { 'team-1': 3 }, lastTeamPoint: 'team-1' }

    setLocalGameState(game, state.scores, state.lastTeamPoint)

    expect(getLocalGameState(game)).toBe(JSON.stringify(state))
  })

  it('should store and retrieve the switch sides value for a game', () => {
    const { setLocalSwitchSides, getLocalSwitchSides } = useLocalStorage()

    setLocalSwitchSides(game, true)

    expect(getLocalSwitchSides(game)).toBe(JSON.stringify({ switchSides: true }))
  })

  it('should return null when no stored game state exists', () => {
    const { getLocalGameState } = useLocalStorage()

    expect(getLocalGameState(game)).toBeNull()
  })

  it('should return null when no stored switch sides state exists', () => {
    const { getLocalSwitchSides } = useLocalStorage()

    expect(getLocalSwitchSides(game)).toBeNull()
  })
})
