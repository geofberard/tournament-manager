import { HashRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { TeamAppShell } from '../components/team/TeamAppShell'
import {
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
import { AdminLoginView } from '../views/admin/AdminLoginView'
import { AdminView } from '../views/admin/AdminView'
import { TeamGamesView } from '../views/team/TeamGamesView'
import { TeamResultsView } from '../views/team/TeamResultsView'

type TeamProtectedLayoutProps = {
  currentTeam: NonNullable<ReturnType<typeof useTeamLogin>['currentTeam']>
  onChangeTeam: () => void
}

const TeamProtectedLayout = ({ currentTeam, onChangeTeam }: TeamProtectedLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => navigate(path)

  return (
    <TeamAppShell
      currentPath={location.pathname}
      currentTeam={currentTeam}
      onChangeTeam={onChangeTeam}
      onNavigate={handleNavigate}
      routes={teamRoutes}
    >
      <Outlet />
    </TeamAppShell>
  )
}

type AppRoutesProps = {
  adminSession: ReturnType<typeof useAdminSession>
  teamSession: ReturnType<typeof useTeamLogin>
}

const AppRoutes = ({ adminSession, teamSession }: AppRoutesProps) => {
  const { currentTeam, handleTeamChange, clearTeamSelection } = teamSession
  const { isAuthenticated, login, logout } = adminSession
  const navigate = useNavigate()

  const handleTeamLogout = () => {
    clearTeamSelection()
    navigate(TEAM_LOGIN_PATH, { replace: true })
  }

  const handleAdminLogout = () => {
    logout()
    navigate(ADMIN_LOGIN_PATH, { replace: true })
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
      </Route>

      <Route
        path={ADMIN_LOGIN_PATH}
        element={
          isAuthenticated ? (
            <Navigate to={ADMIN_HOME_PATH} replace />
          ) : (
            <AdminLoginView onLogin={login} />
          )
        }
      />
      <Route
        path={ADMIN_HOME_PATH}
        element={
          isAuthenticated ? (
            <AdminView onLogout={handleAdminLogout} />
          ) : (
            <Navigate to={ADMIN_LOGIN_PATH} replace />
          )
        }
      />

      <Route path="*" element={<Navigate to={PUBLIC_HOME_PATH} replace />} />
    </Routes>
  )
}

export const Router = () => {
  const teamSession = useTeamLogin()
  const adminSession = useAdminSession()

  return (
    <HashRouter>
      <AppRoutes adminSession={adminSession} teamSession={teamSession} />
    </HashRouter>
  )
}
