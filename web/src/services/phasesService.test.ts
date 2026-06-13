import { describe, expect, it, vi } from 'vitest'
import { deletePhase, listPhases } from './phasesService'
import * as apiErrorModule from './apiError'

vi.mock('./apiClient', () => ({
  fetchJson: vi.fn(),
  phasesApi: {
    deletePhase: vi.fn(),
  },
}))

import { fetchJson, phasesApi } from './apiClient'

const fetchJsonMock = vi.mocked(fetchJson)
const phasesApiMock = vi.mocked(phasesApi)
const getApiErrorCodeMock = vi.spyOn(apiErrorModule, 'getApiErrorCode')

describe('phasesService', () => {
  it('should fetch phases from the API', async () => {
    // GIVEN
    fetchJsonMock.mockResolvedValueOnce([{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }])

    // WHEN
    const result = await listPhases()

    // THEN
    expect(fetchJsonMock).toHaveBeenCalledWith('/api/phases')
    expect(result).toEqual([{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }])
  })

  it('should delete a phase through the API client', async () => {
    // GIVEN
    phasesApiMock.deletePhase.mockResolvedValueOnce(undefined)

    // WHEN
    await deletePhase('phase-1')

    // THEN
    expect(phasesApiMock.deletePhase).toHaveBeenCalledWith({ phaseId: 'phase-1' })
  })

  it('should explain when a phase cannot be deleted because it is used by a game', async () => {
    // GIVEN
    phasesApiMock.deletePhase.mockRejectedValueOnce(new Error('API error'))
    getApiErrorCodeMock.mockResolvedValueOnce('PHASE_IN_USE')

    // WHEN / THEN
    await expect(deletePhase('phase-1')).rejects.toThrow(
      "Cette phase ne peut pas être supprimée car elle est utilisée par un ou plusieurs matchs.",
    )
  })
})
