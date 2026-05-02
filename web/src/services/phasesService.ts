import { fetchJson, type Phase } from './apiClient'

export type { Phase }

export const listPhases = async (): Promise<Phase[]> =>
  fetchJson<Phase[]>('/api/phases')
