export const PUBLIC_HOME_PATH = '/public'

export const TEAM_HOME_PATH = '/team'
export const TEAM_RANKINGS_PATH = '/team/classement'
export const TEAM_GAMES_PATH = '/team/matchs'
export const TEAM_LOGIN_PATH = '/team/login'

export const ADMIN_HOME_PATH = '/admin'
export const ADMIN_LOGIN_PATH = '/admin/login'

export type AppRoute = {
  label: string
  path: string
}

export const teamRoutes: AppRoute[] = [
  {
    label: 'Classement',
    path: TEAM_RANKINGS_PATH,
  },
  {
    label: 'Matchs',
    path: TEAM_GAMES_PATH,
  },
]
