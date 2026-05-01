import { useState } from 'react'
import {
  clearAdminAuthenticated,
  isAdminAuthenticated,
  setAdminAuthenticated,
} from '../services/adminAuthService'

type UseAdminSessionResult = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export function useAdminSession(): UseAdminSessionResult {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminAuthenticated())

  const login = () => {
    setAdminAuthenticated()
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearAdminAuthenticated()
    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    login,
    logout,
  }
}
