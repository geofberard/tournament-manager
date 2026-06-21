import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRankingsView } from './AdminRankingsView'
import * as usePhasesModule from '../../hooks/usePhases'
import * as useGroupRankingsModule from '../../hooks/useGroupRankings'

vi.mock('../../hooks/usePhases', () => ({ usePhases: vi.fn() }))
vi.mock('../../hooks/useGroupRankings', () => ({ usePhaseGroups: vi.fn() }))
vi.mock('../../components/shared/GroupRankingCard', () => ({
  GroupRankingCard: ({ extended, groupId }: { extended: boolean, groupId: string }) =>
    <div>{groupId} - {extended ? 'étendu' : 'simple'}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const usePhaseGroupsMock = vi.mocked(useGroupRankingsModule.usePhaseGroups)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminRankingsView />
  </ThemeProvider>,
)

describe('AdminRankingsView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should display and switch extended group rankings by phase', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
        { id: 'phase-2', name: 'Finales', order: 2, type: 'BRACKET' },
      ],
    })
    usePhaseGroupsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      groups: [{ id: 'Poule A' }],
    })

    renderView()

    expect(screen.getByRole('heading', { name: 'Classements' })).toBeInTheDocument()
    expect(screen.getByText('Poule A - étendu')).toBeInTheDocument()
    expect(usePhaseGroupsMock).toHaveBeenLastCalledWith('phase-1')

    fireEvent.click(screen.getByRole('tab', { name: 'Finales' }))
    expect(usePhaseGroupsMock).toHaveBeenLastCalledWith('phase-2')
  })

  it('should display an empty state when no phase exists', () => {
    usePhasesMock.mockReturnValue({ errorMessage: null, isLoading: false, phases: [] })
    usePhaseGroupsMock.mockReturnValue({ errorMessage: null, isLoading: false, groups: [] })

    renderView()

    expect(screen.getByText("Aucune phase n'est disponible pour le moment.")).toBeInTheDocument()
  })
})
