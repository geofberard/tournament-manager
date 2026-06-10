import { describe, expect, it, vi } from 'vitest'
import { deletePhase, listPhases } from './phasesService'

vi.mock('./apiClient', () => ({
  fetchJson: vi.fn(),
  phasesApi: {
    deletePhase: vi.fn(),
  },
}))

import { fetchJson, phasesApi } from './apiClient'

const fetchJsonMock = vi.mocked(fetchJson)
const phasesApiMock = vi.mocked(phasesApi)

describe('phasesService', () => {
  it('should fetch phases from the API', async () => {
    fetchJsonMock.mockResolvedValueOnce([{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }])

    const result = await listPhases()

    expect(fetchJsonMock).toHaveBeenCalledWith('/api/phases')
    expect(result).toEqual([{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }])
  })

  it('should delete a phase through the API client', async () => {
    phasesApiMock.deletePhase.mockResolvedValueOnce(undefined)

    await deletePhase('phase-1')

    expect(phasesApiMock.deletePhase).toHaveBeenCalledWith({ phaseId: 'phase-1' })
  })
})
