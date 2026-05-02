import { useEffect, useState } from 'react'
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  type AdminLoginPayload,
} from '../services/adminAuthService'

type UseAdminSessionResult = {
  isAuthenticated: boolean
  isLoading: boolean
  username: string | null
  login: (payload: AdminLoginPayload) => Promise<void>
  logout: () => Promise<void>
}

export function useAdminSession(): UseAdminSessionResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    const loadSession = async () => {
      try {
        const session = await getAdminSession()

        if (ignore) {
          return
        }

        setIsAuthenticated(session.authenticated)
        setUsername(session.username)
      } catch {
        if (ignore) {
          return
        }

        setIsAuthenticated(false)
        setUsername(null)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadSession()

    return () => {
      ignore = true
    }
  }, [])

  const login = async (payload: AdminLoginPayload) => {
    const session = await loginAdmin(payload)
    setIsAuthenticated(session.authenticated)
    setUsername(session.username)
  }

  const logout = async () => {
    await logoutAdmin()
    setIsAuthenticated(false)
    setUsername(null)
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    username,
  }
}
