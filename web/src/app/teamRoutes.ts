export const TEAM_LOGIN_PATH = '/login'
export const TEAM_HOME_PATH = '/'

export type TeamRoute = {
  label: string
  path: string
}

export const teamRoutes: TeamRoute[] = [
  {
    label: 'Accueil',
    path: TEAM_HOME_PATH,
  },
]

export const isKnownTeamPath = (path: string) =>
  teamRoutes.some((route) => route.path === path)
