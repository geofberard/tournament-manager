import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { MemoryRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TeamResultsView } from './TeamResultsView'
import * as usePhasesModule from '../../hooks/usePhases'
import * as statisticsService from '../../services/statisticsService'

vi.mock('../../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))

vi.mock('../../services/statisticsService', () => ({
  getPhaseStatistics: vi.fn(),
  listPhasesStatistics: vi.fn(),
}))

const usePhasesMock = vi.mocked(usePhasesModule.usePhases)
const getPhaseStatisticsMock = vi.mocked(statisticsService.getPhaseStatistics)
const listPhasesStatisticsMock = vi.mocked(statisticsService.listPhasesStatistics)

const renderView = () => render(
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter>
        <TeamResultsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </MemoryRouter>
    </ThemeProvider>
  </SWRConfig>,
)

describe('TeamResultsView', () => {
  beforeEach(() => {
    getPhaseStatisticsMock.mockResolvedValue({
      completionRate: 0,
      gameCount: 0,
      teams: [],
      teamStats: [],
    })
    listPhasesStatisticsMock.mockResolvedValue([])
  })

  afterEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  it('should render the team results page with tabs, details and rankings', async () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        {
          id: 'phase-1',
          name: 'Brassage',
          details: 'Premier paragraphe.\n\nSecond paragraphe.',
          order: 1,
        },
        {
          id: 'phase-1-a-parent',
          parentId: 'phase-1',
          name: 'Matin',
          order: 1,
        },
        {
          id: 'phase-1-a',
          parentId: 'phase-1-a-parent',
          name: 'Poule A',
          order: 1,
          type: 'POOL',
        },
      ],
    })
    listPhasesStatisticsMock.mockResolvedValue([{
      completionRate: 1,
      gameCount: 1,
      teams: [
        { id: 'team-1', name: 'Aigles' },
        { id: 'team-2', name: 'Tigres' },
      ],
      teamStats: [],
    }])

    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('heading', { name: 'Résultats' })).toBeInTheDocument()
    expect(screen.queryByText('Bienvenue Tigres')).not.toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Phases du tournoi' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Brassage' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Poule A' })).not.toBeInTheDocument()
    expect(screen.getByText('Premier paragraphe.')).toBeInTheDocument()
    expect(screen.getByText('Second paragraphe.')).toBeInTheDocument()
    expect(await screen.findByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText("Les resultats ne sont pas encore disponibles.")).toBeInTheDocument()
  })

  it('should switch between current team results and every result', async () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-1-b', parentId: 'phase-1', name: 'Poule B', order: 2, type: 'POOL' },
      ],
    })
    listPhasesStatisticsMock.mockResolvedValue([
      {
        completionRate: 1,
        gameCount: 1,
        teams: [{ id: 'team-2', name: 'Tigres' }],
        teamStats: [],
      },
      {
        completionRate: 1,
        gameCount: 1,
        teams: [{ id: 'team-3', name: 'Lions' }],
        teamStats: [],
      },
    ])

    // WHEN
    renderView()

    // THEN
    expect(await screen.findByText('Poule A')).toBeInTheDocument()
    expect(screen.queryByText('Poule B')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: 'Tous les résultats' }))

    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText('Poule B')).toBeInTheDocument()
  })

  it('should select the last root phase by default', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [
        { id: 'phase-1', name: 'Brassage', details: 'Details du brassage', order: 1 },
        { id: 'phase-1-a', parentId: 'phase-1', name: 'Poule A', order: 1, type: 'POOL' },
        { id: 'phase-2', name: 'Finales', details: 'Details des finales', order: 2, type: 'BRACKET' },
      ],
    })
    // WHEN
    renderView()

    // THEN
    expect(screen.getByRole('tab', { name: 'Finales' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Details des finales')).toBeInTheDocument()
    expect(screen.queryByText('Details du brassage')).not.toBeInTheDocument()
  })

  it('should render a fallback message when the phase has no details', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }],
    })
    // WHEN
    renderView()

    // THEN
    expect(screen.getByText("Aucun detail n'est disponible pour cette phase.")).toBeInTheDocument()
  })

  it('should render an empty pool state for bracket phases for now', () => {
    // GIVEN
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{ id: 'phase-2', name: 'Bracket final', order: 2, type: 'BRACKET' }],
    })
    // WHEN
    renderView()

    // THEN
    expect(screen.queryByText("Les resultats ne sont pas encore disponibles.")).not.toBeInTheDocument()
    expect(screen.getByText("Aucune poule n'est disponible pour cette phase.")).toBeInTheDocument()
  })
})
