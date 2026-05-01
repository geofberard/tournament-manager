import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it, vi } from 'vitest'
import { TeamsView } from './TeamsView'
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

describe('TeamsView', () => {
  it('should assemble the team home page with rankings and matches', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })
    useRankingsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamsView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()
    expect(screen.getByText('Classement')).toBeInTheDocument()
  })
})
