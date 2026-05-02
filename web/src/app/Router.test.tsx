import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Router } from './Router'
import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  PUBLIC_HOME_PATH,
  TEAM_GAMES_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  TEAM_RESULTS_PATH,
} from './routes'
import * as useGamesModule from '../hooks/useGames'
import * as useRankingsModule from '../hooks/useRankings'
import * as useTeamLoginModule from '../hooks/useTeamLogin'
import * as useAdminSessionModule from '../hooks/useAdminSession'
import * as useTeamsModule from '../hooks/useTeams'

vi.mock('../hooks/useTeamLogin', () => ({
  useTeamLogin: vi.fn(),
}))

vi.mock('../hooks/useAdminSession', () => ({
  useAdminSession: vi.fn(),
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
const useAdminSessionMock = vi.mocked(useAdminSessionModule.useAdminSession)
const useTeamsMock = vi.mocked(useTeamsModule.useTeams)
const useGamesMock = vi.mocked(useGamesModule.useGames)
const useRankingsMock = vi.mocked(useRankingsModule.useRankings)

const renderRouter = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <Router />
    </ThemeProvider>,
  )

const setHashPath = (path: string) => {
  window.location.hash = `#${path}`
}

describe('Router', () => {
  beforeEach(() => {
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
      groupName: 'Poule A',
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })
  })

  afterEach(() => {
    cleanup()
    window.location.hash = ''
  })

  it('should render the public page for /public', () => {
    setHashPath(PUBLIC_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    expect(screen.getByText('Zone publique')).toBeInTheDocument()
  })

  it('should redirect /team to /team/login when no team is selected', async () => {
    setHashPath(TEAM_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      teams: [],
    })

    renderRouter()

    expect(screen.getByText('Tournois')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${TEAM_LOGIN_PATH}`)
    })
  })

  it('should render the team area when a team is selected', async () => {
    setHashPath(TEAM_LOGIN_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${TEAM_RESULTS_PATH}`)
    })
  })

  it('should render the team matches page when requested', () => {
    setHashPath(TEAM_GAMES_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    expect(screen.getByRole('heading', { name: 'Prochains matchs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Matchs terminés' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Resultats' })).not.toBeInTheDocument()
  })

  it('should redirect /admin to /admin/login when the admin is not authenticated', async () => {
    setHashPath(ADMIN_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    expect(screen.getByText('Connexion admin')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${ADMIN_LOGIN_PATH}`)
    })
  })

  it('should render the admin area when the admin is authenticated', async () => {
    setHashPath(ADMIN_LOGIN_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    expect(screen.getByText('Zone admin')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${ADMIN_HOME_PATH}`)
    })
  })

  it("should allow clearing the selected team from the team area", () => {
    const clearTeamSelection = vi.fn()

    setHashPath(TEAM_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection,
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    })

    renderRouter()

    fireEvent.click(screen.getByRole('button', { name: "Changer d'équipe" }))

    expect(clearTeamSelection).toHaveBeenCalledOnce()
  })
})
