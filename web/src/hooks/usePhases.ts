import useSWR from 'swr'
import { listPhases, type Phase } from '../services/phasesService'

export function usePhases() {
  const { data, error, isLoading } = useSWR<Phase[]>('/api/phases', listPhases)

  return {
    errorMessage: error instanceof Error ? error.message : error ? 'Le chargement des phases a echoue.' : null,
    isLoading,
    phases: data ?? [],
  }
}
