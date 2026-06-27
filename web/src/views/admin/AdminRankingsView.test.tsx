import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminRankingsView } from './AdminRankingsView'
import * as usePhasesModule from '../../hooks/usePhases'

vi.mock('../../hooks/usePhases', () => ({ usePhases: vi.fn() }))
vi.mock('../../components/shared/PhaseRankingCard', () => ({
  PhaseRankingCard: ({ extended, phaseName }: { extended: boolean, phaseName: string }) =>
    <div>{phaseName} - {extended ? 'étendu' : 'simple'}</div>,
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminRankingsView />
  </ThemeProvider>,
)

describe('AdminRankingsView', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should display and switch extended rankings by phase', () => {
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
        { id: 'phase-2', name: 'Finales', order: 2, type: 'BRACKET' },
      ],
    })
    renderView()

    expect(screen.getByRole('heading', { name: 'Classements' })).toBeInTheDocument()
    expect(screen.getByText('Brassage - étendu')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Finales' }))
    expect(screen.getByText('Finales - étendu')).toBeInTheDocument()
  })

  it('should display an empty state when no phase exists', () => {
    usePhasesMock.mockReturnValue({ errorMessage: null, isLoading: false, phases: [] })
    renderView()

    expect(screen.getByText("Aucune phase n'est disponible pour le moment.")).toBeInTheDocument()
  })
})
