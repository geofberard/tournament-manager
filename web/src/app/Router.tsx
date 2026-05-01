import { useEffect, useState } from 'react'
import { TeamAppShell } from '../components/team-app/TeamAppShell'
import {
  TEAM_HOME_PATH,
  TEAM_LOGIN_PATH,
  isKnownTeamPath,
  teamRoutes,
} from './teamRoutes'
import { TeamSelectionView } from '../views/TeamSelectionView'
import { useTeamLogin } from '../hooks/useTeamLogin'
import { TeamsView } from '../views/TeamsView'

const readCurrentPath = () => window.location.pathname || TEAM_HOME_PATH

const updateCurrentPath = (nextPath: string, replace = false) => {
  const currentPath = readCurrentPath()

  if (currentPath === nextPath) {
    return
  }

  window.history[replace ? 'replaceState' : 'pushState'](null, '', nextPath)
}

export function Router() {
  const { clearTeamSelection, currentTeam, handleTeamChange } = useTeamLogin()
  const [currentPath, setCurrentPath] = useState(readCurrentPath)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(readCurrentPath())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (!currentTeam) {
      if (currentPath !== TEAM_LOGIN_PATH) {
        updateCurrentPath(TEAM_LOGIN_PATH, true)
        setCurrentPath(TEAM_LOGIN_PATH)
      }

      return
    }

    if (currentPath === TEAM_LOGIN_PATH || !isKnownTeamPath(currentPath)) {
      updateCurrentPath(TEAM_HOME_PATH, true)
      setCurrentPath(TEAM_HOME_PATH)
    }
  }, [currentPath, currentTeam])

  const navigateTo = (nextPath: string) => {
    updateCurrentPath(nextPath)
    setCurrentPath(nextPath)
  }

  const handleChangeTeam = () => {
    clearTeamSelection()
    updateCurrentPath(TEAM_LOGIN_PATH, true)
    setCurrentPath(TEAM_LOGIN_PATH)
  }

  if (!currentTeam) {
    return <TeamSelectionView onTeamChange={handleTeamChange} />
  }

  const normalizedPath = isKnownTeamPath(currentPath) ? currentPath : TEAM_HOME_PATH

  return (
    <TeamAppShell
      currentPath={normalizedPath}
      currentTeam={currentTeam}
      onChangeTeam={handleChangeTeam}
      onNavigate={navigateTo}
      routes={teamRoutes}
    >
      <TeamsView currentTeam={currentTeam} />
    </TeamAppShell>
  )
}
