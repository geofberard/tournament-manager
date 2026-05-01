const ADMIN_AUTH_KEY = 'admin_authenticated'

const readAuthFlag = () => window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true'

export const isAdminAuthenticated = () => readAuthFlag()

export const setAdminAuthenticated = () => {
  window.localStorage.setItem(ADMIN_AUTH_KEY, 'true')
}

export const clearAdminAuthenticated = () => {
  window.localStorage.removeItem(ADMIN_AUTH_KEY)
}
