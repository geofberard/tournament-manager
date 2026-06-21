import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminTerrainsView } from './AdminTerrainsView'
import * as useGamesModule from '../../hooks/useGames'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)

const renderView = () => render(
  <ThemeProvider theme={createTheme()}>
    <AdminTerrainsView />
  </ThemeProvider>,
)

describe('AdminTerrainsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display current and upcoming games by court', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      games: [{
        id: 'game-1',
        position: 1,
        court: 'Terrain 1',
        status: 'scheduled',
        time: new Date('2099-06-18T12:00:00Z'),
        contestants: new Set([{ id: 'team-1', name: 'Aigles' }, { id: 'team-2', name: 'Lions' }]),
        referee: { id: 'team-3', name: 'Panthères' },
        group: 'Poule A',
        phase: { id: 'phase-1', type: 'POOL', name: 'Phase 1', order: 1 },
        score: { pointsByTeam: {} },
      }],
    })

    renderView()

    expect(screen.getByRole('heading', { name: 'Terrains' })).toBeInTheDocument()
    expect(screen.getByText('Terrain 1')).toBeInTheDocument()
    expect(screen.getByText('Aigles vs Lions')).toBeInTheDocument()
    expect(screen.getByText('Arbitre : Panthères')).toBeInTheDocument()
  })

  it('should display loading and error states', () => {
    useGamesMock.mockReturnValue({
      errorMessage: 'Matchs indisponibles',
      isLoading: true,
      games: [],
    })

    renderView()

    expect(screen.getByText('Matchs indisponibles')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
