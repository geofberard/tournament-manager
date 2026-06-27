import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AlertProvider } from '../app/AlertProvider'
import { Router } from './Router'
import type { Game } from '../services/apiClient'
import { GameStatus } from '../generated/api-client'
import {
  ADMIN_GAMES_PATH,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_PHASES_PATH,
  ADMIN_TEAMS_PATH,
  ADMIN_COURTS_PATH,
  ADMIN_RESULTS_PATH,
  PUBLIC_HOME_PATH,
  TEAM_REFEREE_GAME_PATH,
  TEAM_GAMES_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
} from './routes'
import * as useGamesModule from '../hooks/useGames'
import * as useGameModule from '../hooks/useGame'
import * as usePhaseRankingsModule from '../hooks/usePhaseRankings'
import * as useTeamLoginModule from '../hooks/useTeamLogin'
import * as useAdminSessionModule from '../hooks/useAdminSession'
import * as usePhasesModule from '../hooks/usePhases'
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

vi.mock('../hooks/useGame', () => ({
  useGame: vi.fn(),
}))

vi.mock('../hooks/usePhaseRankings', () => ({
  usePhaseRankings: vi.fn(),
}))

vi.mock('../hooks/usePhases', () => ({
  usePhases: vi.fn(),
}))


const useTeamLoginMock = vi.mocked(useTeamLoginModule.useTeamLogin)
const useAdminSessionMock = vi.mocked(useAdminSessionModule.useAdminSession)
const useTeamsMock = vi.mocked(useTeamsModule.useTeams)
const useGamesMock = vi.mocked(useGamesModule.useGames)
const useGameMock = vi.mocked(useGameModule.useGame)
const usePhaseRankingsMock = vi.mocked(usePhaseRankingsModule.usePhaseRankings)
const usePhasesMock = vi.mocked(usePhasesModule.usePhases)

const renderRouter = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <AlertProvider>
        <Router />
      </AlertProvider>
    </ThemeProvider>,
  )

const setPath = (path: string) => {
  window.history.replaceState({}, '', path)
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
    useGameMock.mockReturnValue({
      game: null,
      isLoading: false,
      errorMessage: null,
    })
    usePhaseRankingsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      rankings: [],
    })
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [],
    })
  })

  afterEach(() => {
    cleanup()
    window.history.replaceState({}, '', '/')
  })

  it('should render the public page for /public', () => {
    // GIVEN
    setPath(PUBLIC_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByText("Aucun tournoi n'est configuré pour le moment.")).toBeInTheDocument()
  })

  it('should redirect /team to /team/login when no team is selected', async () => {
    // GIVEN
    setPath(TEAM_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: true,
      teams: [],
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByText('Tournois')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.pathname).toBe(TEAM_LOGIN_PATH)
    })
  })

  it('should render the team home page when a team is selected', async () => {
    // GIVEN
    setPath(TEAM_LOGIN_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByText('Espace équipe')).toBeInTheDocument()
    expect(screen.getByText('Bienvenue Tigres')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ouvrir résultats' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ouvrir matchs' })).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.pathname).toBe(TEAM_HOME_PATH)
    })
  })

  it('should render the team matches page when requested', () => {
    // GIVEN
    setPath(TEAM_GAMES_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          id: 'game-1',
          position: 1,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          court: 'Court 1',
          time: new Date('2099-01-01T10:00:00Z'),
          status: GameStatus.Scheduled,
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        },
        {
          id: 'game-2',
          position: 2,
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          court: 'Court 1',
          status: GameStatus.Completed,
          contestants: new Set([{ id: 'team-2', name: 'Tigres' }]),
        },
      ] as Game[],
      isLoading: false,
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'À venir' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Terminés' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Résultats' })).not.toBeInTheDocument()
  })

  it('should redirect /admin to /admin/login when the admin is not authenticated', async () => {
    // GIVEN
    setPath(ADMIN_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByText('Connexion admin')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.pathname).toBe(ADMIN_LOGIN_PATH)
    })
  })

  it('should render the admin area when the admin is authenticated', async () => {
    // GIVEN
    setPath(ADMIN_LOGIN_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se deconnecter' })).toBeInTheDocument()

    await waitFor(() => {
      expect(window.location.pathname).toBe(ADMIN_GAMES_PATH)
    })
  })

  it('should render the admin phases page when requested', () => {
    // GIVEN
    setPath(ADMIN_PHASES_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })
    usePhasesMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      phases: [{ details: 'Premiere phase', id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' }],
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByRole('heading', { name: 'Phases' })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
  })

  it('should render the admin games page when requested', () => {
    // GIVEN
    setPath(ADMIN_GAMES_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })
    useGamesMock.mockReturnValue({
      errorMessage: null,
      games: [
        {
          contestants: new Set([
            { id: 'team-1', name: 'Tigres' },
            { id: 'team-2', name: 'Lynx' },
          ]),
          court: 'Terrain 1',
          id: 'game-1',
          phase: { id: 'phase-1', name: 'Brassage', order: 1, type: 'POOL' },
          referee: { id: 'team-3', name: 'Aigles' },
          score: { pointsByTeam: { 'team-1': 21, 'team-2': 18 } },
          status: 'completed',
          time: new Date('2026-05-03T10:30:00.000Z'),
        },
      ],
      isLoading: false,
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByRole('heading', { name: 'Matchs' })).toBeInTheDocument()
    expect(screen.getByText('Brassage')).toBeInTheDocument()
  })

  it('should render the admin teams page when requested', () => {
    // GIVEN
    setPath(ADMIN_TEAMS_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })
    useTeamsMock.mockReturnValue({
      errorMessage: null,
      isLoading: false,
      teams: [{ id: 'team-1', name: 'Aigles' }],
    })

    // WHEN
    renderRouter()

    // THEN
    expect(screen.getByRole('heading', { name: 'Équipes' })).toBeInTheDocument()
    expect(screen.getByText('Aigles')).toBeInTheDocument()
  })

  it('should render the admin terrains page when requested', () => {
    setPath(ADMIN_COURTS_PATH)
    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })

    renderRouter()

    expect(screen.getByRole('heading', { name: 'Terrains' })).toBeInTheDocument()
    expect(screen.getByText('Aucun match planifié sur les terrains.')).toBeInTheDocument()
  })

  it('should render the admin results page when requested', () => {
    setPath(ADMIN_RESULTS_PATH)
    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: 'admin',
    })

    renderRouter()

    expect(screen.getByRole('heading', { name: 'Classements' })).toBeInTheDocument()
  })

  it('should allow logging out from the admin area', () => {
    // GIVEN
    const logout = vi.fn().mockResolvedValue(undefined)

    setPath(ADMIN_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: null,
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout,
      username: 'admin',
    })

    renderRouter()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: 'Se deconnecter' }))

    // THEN
    expect(logout).toHaveBeenCalledOnce()
  })

  it("should allow clearing the selected team from the team area", () => {
    // GIVEN
    const clearTeamSelection = vi.fn()

    setPath(TEAM_HOME_PATH)

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection,
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    renderRouter()

    expect(screen.getByTestId('SwapHorizIcon')).toBeInTheDocument()

    // WHEN
    fireEvent.click(screen.getByRole('button', { name: "Changer d'équipe" }))

    // THEN
    expect(clearTeamSelection).toHaveBeenCalledOnce()
  })

  it('should render the referee game view when navigating to referee path', () => {
    const sampleGame: Game = {
      id: 'game-1',
      phase: { id: 'phase-1', name: 'Phase Finale', order: 1, type: 'POOL' },
      time: new Date(),
      court: 'Terrain 1',
      status: 'scheduled',
      contestants: new Set([
        { id: 'team-2', name: 'Tigres' },
        { id: 'team-3', name: 'Lions' },
      ]),
      score: { pointsByTeam: { 'team-2': 0, 'team-3': 0 } },
    }

    setPath(TEAM_REFEREE_GAME_PATH.replace(':id', 'game-1'))

    useTeamLoginMock.mockReturnValue({
      clearTeamSelection: vi.fn(),
      currentTeam: { id: 'team-2', name: 'Tigres' },
      handleTeamChange: vi.fn(),
    })
    useAdminSessionMock.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      username: null,
    })

    useGameMock.mockReturnValue({
      game: sampleGame,
      isLoading: false,
      errorMessage: null,
    })

    renderRouter()

    expect(screen.getByRole('heading', { name: 'Tigres VS Lions' })).toBeInTheDocument()
    expect(screen.getByText(/Terrain 1/)).toBeInTheDocument()
    expect(screen.getByText(/Phase Finale/)).toBeInTheDocument()
  })
})
