export const PUBLIC_HOME_PATH = '/public'

export const TEAM_HOME_PATH = '/team'
export const TEAM_LOGIN_PATH = '/team/login'

export const ADMIN_HOME_PATH = '/admin'
export const ADMIN_LOGIN_PATH = '/admin/login'

export type AppRoute = {
  label: string
  path: string
}

export const teamRoutes: AppRoute[] = [
  {
    label: 'Accueil',
    path: TEAM_HOME_PATH,
  },
]
