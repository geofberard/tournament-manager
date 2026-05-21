export const PUBLIC_HOME_PATH = '/public'

export const TEAM_HOME_PATH = '/team'
export const TEAM_RESULTS_PATH = '/team/results'
export const TEAM_GAMES_PATH = '/team/games'
export const TEAM_LOGIN_PATH = '/team/login'
export const TEAM_REFEREE_GAME_PATH = '/team/referee/game/:id'

export const ADMIN_HOME_PATH = '/admin'
export const ADMIN_GAMES_PATH = '/admin/games'
export const ADMIN_LOGIN_PATH = '/admin/login'
export const ADMIN_PHASES_PATH = '/admin/phases'
export const ADMIN_TEAMS_PATH = '/admin/teams'

export type AppRoute = {
  label: string
  path: string
}

export const teamRoutes: AppRoute[] = [
  {
    label: 'Resultats',
    path: TEAM_RESULTS_PATH,
  },
  {
    label: 'Matchs',
    path: TEAM_GAMES_PATH,
  },
]

export const adminRoutes: AppRoute[] = [
  {
    label: 'Accueil',
    path: ADMIN_HOME_PATH,
  },
  {
    label: 'Phases',
    path: ADMIN_PHASES_PATH,
  },
  {
    label: 'Equipes',
    path: ADMIN_TEAMS_PATH,
  },
  {
    label: 'Matchs',
    path: ADMIN_GAMES_PATH,
  },
]
