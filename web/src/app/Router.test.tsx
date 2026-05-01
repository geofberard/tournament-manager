import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Router } from './Router'
import { TEAM_HOME_PATH, TEAM_LOGIN_PATH } from './teamRoutes'
import * as useGamesModule from '../hooks/useGames'
import * as useRankingsModule from '../hooks/useRankings'
import * as useTeamLoginModule from '../hooks/useTeamLogin'
import * as useTeamsModule from '../hooks/useTeams'

vi.mock('../hooks/useTeamLogin', () => ({
  useTeamLogin: vi.fn(),
}))

vi.mock('../hooks/useTeams', () => ({
  useTeams: vi.fn(),
}))

vi.mock('../hooks/useGames', () => ({
  useGames: vi.fn(),
}))

vi.mock('../hooks/useRankings', () => ({
  useRankings: vi.fn(),
}))

const useTeamLoginMock = vi.mocked(useTeamLoginModule.useTeamLogin)
const useTeamsMock = vi.mocked(useTeamsModule.useTeams)
const useGamesMock = vi.mocked(useGamesModule.useGames)
const useRankingsMock = vi.mocked(useRankingsModule.useRankings)

const renderRouter = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <Router />
    </ThemeProvider>,
  )

describe('Router', () => {
  afterEach(() => {
    cleanup()
    window.history.replaceState(null, '', TEAM_HOME_PATH)
  })

  it("should render the selection page when no team is selected", () => {
    window.history.replaceState(null, '', TEAM_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      teams: [],
    })
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

    renderRouter()

    expect(screen.getByText('Tournois')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(window.location.pathname).toBe(TEAM_LOGIN_PATH)
  })

  it('should render the teams page when a team is selected', () => {
    window.history.replaceState(null, '', TEAM_LOGIN_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [],
    })
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

    renderRouter()

    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()
    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(window.location.pathname).toBe(TEAM_HOME_PATH)
  })

  it("should allow clearing the selected team from the teams page", () => {
    const clearTeamSelection = vi.fn()

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection,
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [],
    })
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

    renderRouter()

    fireEvent.click(screen.getByRole('button', { name: "Changer d'équipe" }))

    expect(clearTeamSelection).toHaveBeenCalledOnce()
  })
})
