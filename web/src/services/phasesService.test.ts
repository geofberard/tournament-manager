import { describe, expect, it, vi } from 'vitest'
import { listPhases } from './phasesService'

vi.mock('./apiClient', () => ({
  fetchJson: vi.fn(),
}))

import { fetchJson } from './apiClient'

const fetchJsonMock = vi.mocked(fetchJson)

describe('phasesService', () => {
  it('should fetch phases from the API', async () => {
    fetchJsonMock.mockResolvedValueOnce([{ id: 'phase-1', name: 'Brassage', order: 1 }])

    const result = await listPhases()

    expect(fetchJsonMock).toHaveBeenCalledWith('/api/phases')
    expect(result).toEqual([{ id: 'phase-1', name: 'Brassage', order: 1 }])
  })
})
