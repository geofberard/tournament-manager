import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamGamesView } from './TeamGamesView'
import * as useGamesModule from '../../hooks/useGames'

vi.mock('../../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

const useGamesMock = vi.mocked(useGamesModule.useGames)

describe('TeamGamesView', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render the two game sections', () => {
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [],
      isLoading: false,
    })

    render(
      <ThemeProvider theme={createTheme()}>
        <TeamGamesView currentTeam={{ id: 'team-2', name: 'Tigres' }} />
      </ThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Prochains matchs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Matchs terminés' })).toBeInTheDocument()
  })
})
