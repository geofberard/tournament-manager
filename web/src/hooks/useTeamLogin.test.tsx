import { act, renderHook } from '@testing-library/react'
import type { SelectChangeEvent } from '@mui/material'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTeamLogin } from './useTeamLogin'
import * as currentTeamService from '../services/currentTeamService'
import type { Team } from '../services/teamsService'

vi.mock('../services/currentTeamService', () => ({
  clearCurrentTeam: vi.fn(),
  getCurrentTeam: vi.fn(),
  setCurrentTeam: vi.fn(),
}))

const getCurrentTeamMock = vi.mocked(currentTeamService.getCurrentTeam)
const setCurrentTeamMock = vi.mocked(currentTeamService.setCurrentTeam)
const clearCurrentTeamMock = vi.mocked(currentTeamService.clearCurrentTeam)

const teams: Team[] = [
  { id: 'team-1', name: 'Aigles' },
  { id: 'team-2', name: 'Tigres' },
]

const createSelectEvent = (value: string) =>
  ({ target: { value } } as SelectChangeEvent<string>)

describe('useTeamLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize the current team from storage', () => {
    // GIVEN
    getCurrentTeamMock.mockReturnValueOnce(teams[1])

    // WHEN
    const { result } = renderHook(() => useTeamLogin())

    // THEN
    expect(result.current.currentTeam).toEqual(teams[1])
  })

  it('should persist the selected team', () => {
    // GIVEN
    getCurrentTeamMock.mockReturnValueOnce(null)

    // WHEN
    const { result } = renderHook(() => useTeamLogin())
    act(() => {
      result.current.handleTeamChange(teams, createSelectEvent('team-2'))
    })

    // THEN
    expect(result.current.currentTeam).toEqual(teams[1])
    expect(setCurrentTeamMock).toHaveBeenCalledWith(teams[1])
    expect(clearCurrentTeamMock).not.toHaveBeenCalled()
  })

  it('should clear the current team when the empty option is selected', () => {
    // GIVEN
    getCurrentTeamMock.mockReturnValueOnce(teams[0])

    // WHEN
    const { result } = renderHook(() => useTeamLogin())
    act(() => {
      result.current.handleTeamChange(teams, createSelectEvent(''))
    })

    // THEN
    expect(result.current.currentTeam).toBeNull()
    expect(clearCurrentTeamMock).toHaveBeenCalled()
  })

  it('should clear the current team when the selected id does not match any team', () => {
    // GIVEN
    getCurrentTeamMock.mockReturnValueOnce(teams[0])

    // WHEN
    const { result } = renderHook(() => useTeamLogin())
    act(() => {
      result.current.handleTeamChange(teams, createSelectEvent('missing-team'))
    })

    // THEN
    expect(result.current.currentTeam).toBeNull()
    expect(clearCurrentTeamMock).toHaveBeenCalled()
    expect(setCurrentTeamMock).not.toHaveBeenCalled()
  })

  it('should clear the current team selection explicitly', () => {
    // GIVEN
    getCurrentTeamMock.mockReturnValueOnce(teams[0])

    // WHEN
    const { result } = renderHook(() => useTeamLogin())
    act(() => {
      result.current.clearTeamSelection()
    })

    // THEN
    expect(result.current.currentTeam).toBeNull()
    expect(clearCurrentTeamMock).toHaveBeenCalledOnce()
  })
})
