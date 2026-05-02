import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamResultsContent } from './TeamResultsContent'
import * as useGamesModule from '../../hooks/useGames'
import * as useRankingsModule from '../../hooks/useRankings'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../../hooks/useRankings', () => ({
  useRankings: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)
const useRankingsMock = vi.mocked(useRankingsModule.useRankings)

describe('TeamResultsContent', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render pool rankings for the selected phase', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    useRankingsMock.mockReturnValue({
      groupName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamResultsContent
          currentTeam={{ id: 'team-2', name: 'Tigres' }}
          selectedPhase={{ id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }}
        />
      </ThemeProvider>,
    )

    expect(screen.getByText('Poule A')).toBeInTheDocument()
    expect(screen.getByText("Les resultats ne sont pas encore disponibles.")).toBeInTheDocument()
  })
})
