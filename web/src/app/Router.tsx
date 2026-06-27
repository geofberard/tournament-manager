import { CircularProgress, Stack } from '@mui/material'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import scufLogo from '../assets/scuf-logo.svg'
import { AppShell } from '../components/shared/AppShell'
import {
  adminRoutes,
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  PUBLIC_HOME_PATH,
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  TEAM_RESULTS_PATH,
  teamRoutes,
} from './routes'
import { TeamSelectionView } from '../views/team/TeamSelectionView'
import { useTeamLogin } from '../hooks/useTeamLogin'
import { useAdminSession } from '../hooks/useAdminSession'
import { PublicView } from '../views/public/PublicView'
import { AdminGamesView } from '../views/admin/AdminGamesView'
import { AdminLoginView } from '../views/admin/AdminLoginView'
import { AdminView } from '../views/admin/AdminView'
import { AdminPhasesView } from '../views/admin/AdminPhasesView'
import { AdminTeamsView } from '../views/admin/AdminTeamsView'
import { AdminTerrainsView } from '../views/admin/AdminTerrainsView'
import { AdminRankingsView } from '../views/admin/AdminRankingsView'
import { TeamGamesView } from '../views/team/TeamGamesView'
import { TeamResultsView } from '../views/team/TeamResultsView'
import { TeamRefereeGameView } from '../views/team/TeamRefereeGameView'
import { TeamTerrainView } from '../views/team/TeamTerrainView'
import { TeamBuvetteView } from '../views/team/TeamBuvetteView'

type TeamProtectedLayoutProps = {
  currentTeam: NonNullable<ReturnType<typeof useTeamLogin>['currentTeam']>
  onChangeTeam: () => void
}

const TeamProtectedLayout = ({ currentTeam, onChangeTeam }: TeamProtectedLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => navigate(path)

  return (
    <AppShell
      title="Espace équipe"
      subtitle={currentTeam.name}
      pages={teamRoutes}
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      actionIcon={<SwapHorizIcon />}
      actionLabel="Changer d'équipe"
      onActionClick={onChangeTeam}
      logoSrc={scufLogo}
      logoAlt="SCUF"
    >
      <Outlet />
    </AppShell>
  )
}

type AdminProtectedLayoutProps = {
  onLogout: () => Promise<void>
  username: string | null
}

const AdminProtectedLayout = ({ onLogout, username }: AdminProtectedLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => navigate(path)

  return (
    <AppShell
      title="Zone admin"
      subtitle={username ? `Connecte en tant que ${username}` : undefined}
      pages={adminRoutes}
      currentPath={location.pathname}
      onNavigate={handleNavigate}
      actionLabel="Se deconnecter"
      onActionClick={() => {
        void onLogout()
      }}
      logoSrc={scufLogo}
      logoAlt="SCUF"
    >
      <Outlet />
    </AppShell>
  )
}

type AppRoutesProps = {
  adminSession: ReturnType<typeof useAdminSession>
  teamSession: ReturnType<typeof useTeamLogin>
}

const AppRoutes = ({ adminSession, teamSession }: AppRoutesProps) => {
  const { currentTeam, handleTeamChange, clearTeamSelection } = teamSession
  const { isAuthenticated, isLoading, login, logout, username } = adminSession
  const navigate = useNavigate()

  const adminLoadingFallback = (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
      <CircularProgress />
    </Stack>
  )

  const handleTeamLogout = () => {
    clearTeamSelection()
    navigate(TEAM_LOGIN_PATH, { replace: true })
  }

  const handleAdminLogout = async () => {
    try {
      await logout()
    } finally {
      navigate(ADMIN_LOGIN_PATH, { replace: true })
    }
  }

  const handleAdminLogin = async (loginUsername: string, password: string) => {
    await login({ username: loginUsername, password })
    navigate(ADMIN_HOME_PATH, { replace: true })
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={PUBLIC_HOME_PATH} replace />} />
      <Route path={PUBLIC_HOME_PATH} element={<PublicView />} />

      <Route
        path={TEAM_LOGIN_PATH}
        element={
          currentTeam ? (
            <Navigate to={TEAM_HOME_PATH} replace />
          ) : (
            <TeamSelectionView onTeamChange={handleTeamChange} />
          )
        }
      />
      <Route
        path={TEAM_HOME_PATH}
        element={
          currentTeam ? (
            <TeamProtectedLayout currentTeam={currentTeam} onChangeTeam={handleTeamLogout} />
          ) : (
            <Navigate to={TEAM_LOGIN_PATH} replace />
          )
        }
      >
        <Route index element={<Navigate to={TEAM_RESULTS_PATH} replace />} />
        <Route path="results" element={<TeamResultsView currentTeam={currentTeam ?? undefined!} />} />
        <Route path="games" element={<TeamGamesView currentTeam={currentTeam ?? undefined!} />} />
        <Route path="terrains" element={<TeamTerrainView />} />
        <Route path="buvette" element={<TeamBuvetteView />} />
        <Route path="referee/game/:id" element={<TeamRefereeGameView />} />
      </Route>

      <Route
        path={ADMIN_LOGIN_PATH}
        element={
          isLoading ? (
            adminLoadingFallback
          ) : isAuthenticated ? (
            <Navigate to={ADMIN_HOME_PATH} replace />
          ) : (
            <AdminLoginView onLogin={handleAdminLogin} />
          )
        }
      />
      <Route
        path={ADMIN_HOME_PATH}
        element={
          isLoading ? (
            adminLoadingFallback
          ) : isAuthenticated ? (
            <AdminProtectedLayout onLogout={handleAdminLogout} username={username} />
          ) : (
            <Navigate to={ADMIN_LOGIN_PATH} replace />
          )
        }
      >
        <Route index element={<AdminView username={username} />} />
        <Route path="games" element={<AdminGamesView />} />
        <Route path="phases" element={<AdminPhasesView />} />
        <Route path="teams" element={<AdminTeamsView />} />
        <Route path="courts" element={<AdminTerrainsView />} />
        <Route path="results" element={<AdminRankingsView />} />
      </Route>

      <Route path="*" element={<Navigate to={PUBLIC_HOME_PATH} replace />} />
    </Routes>
  )
}

export const Router = () => {
  const teamSession = useTeamLogin()
  const adminSession = useAdminSession()

  return (
    <BrowserRouter>
      <AppRoutes adminSession={adminSession} teamSession={teamSession} />
    </BrowserRouter>
  )
}
