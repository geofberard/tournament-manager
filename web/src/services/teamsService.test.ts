import { describe, expect, it, vi } from 'vitest'
import { createTeam, deleteTeam, listTeams, updateTeam } from './teamsService'
import * as apiErrorModule from './apiError'

vi.mock('./apiClient', () => ({
  fetchJson: vi.fn(),
  teamsApi: {
    createTeam: vi.fn(),
    deleteTeam: vi.fn(),
    listTeams: vi.fn(),
    updateTeam: vi.fn(),
  },
}))

import { teamsApi } from './apiClient'

const teamsApiMock = vi.mocked(teamsApi)
const getApiErrorCodeMock = vi.spyOn(apiErrorModule, 'getApiErrorCode')

describe('teamsService', () => {
  it('should list teams through the API client', async () => {
    // GIVEN
    teamsApiMock.listTeams.mockResolvedValueOnce([{ id: 'team-1', name: 'Aigles' }])

    // WHEN
    const result = await listTeams()

    // THEN
    expect(teamsApiMock.listTeams).toHaveBeenCalledOnce()
    expect(result).toEqual([{ id: 'team-1', name: 'Aigles' }])
  })

  it('should create a team through the API client', async () => {
    // GIVEN
    teamsApiMock.createTeam.mockResolvedValueOnce({ id: 'team-1', name: 'Aigles' })

    // WHEN
    await createTeam({ name: 'Aigles' })

    // THEN
    expect(teamsApiMock.createTeam).toHaveBeenCalledWith({ createTeamRequest: { name: 'Aigles' } })
  })

  it('should update a team through the API client', async () => {
    // GIVEN
    teamsApiMock.updateTeam.mockResolvedValueOnce({ id: 'team-1', name: 'Faucons' })

    // WHEN
    await updateTeam('team-1', { name: 'Faucons' })

    // THEN
    expect(teamsApiMock.updateTeam).toHaveBeenCalledWith({
      teamId: 'team-1',
      updateTeamRequest: { name: 'Faucons' },
    })
  })

  it('should delete a team through the API client', async () => {
    // GIVEN
    teamsApiMock.deleteTeam.mockResolvedValueOnce(undefined)

    // WHEN
    await deleteTeam('team-1')

    // THEN
    expect(teamsApiMock.deleteTeam).toHaveBeenCalledWith({ teamId: 'team-1' })
  })

  it('should explain when a team cannot be deleted because it participates in a game', async () => {
    // GIVEN
    teamsApiMock.deleteTeam.mockRejectedValueOnce(new Error('API error'))
    getApiErrorCodeMock.mockResolvedValueOnce('TEAM_IN_USE')

    // WHEN / THEN
    await expect(deleteTeam('team-1')).rejects.toThrow(
      "Cette équipe ne peut pas être supprimée car elle participe à un ou plusieurs matchs.",
    )
  })
})
