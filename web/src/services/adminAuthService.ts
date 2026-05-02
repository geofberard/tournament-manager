import type { AdminLoginRequest, AdminSession as GeneratedAdminSession } from '../generated/api-client'
import { ResponseError } from '../generated/api-client/runtime'
import { adminAuthApi } from './apiClient'

export type AdminLoginPayload = AdminLoginRequest
export type AdminSession = Omit<GeneratedAdminSession, 'username'> & {
  username: string | null
}

const normalizeAdminSession = (session: GeneratedAdminSession): AdminSession => ({
  authenticated: session.authenticated,
  username: session.username ?? null,
})

export const getAdminSession = async (): Promise<AdminSession> => {
  return normalizeAdminSession(await adminAuthApi.getAdminSession())
}

export const loginAdmin = async ({ username, password }: AdminLoginPayload): Promise<AdminSession> => {
  try {
    return normalizeAdminSession(
      await adminAuthApi.loginAdmin({
      adminLoginRequest: {
        username,
        password,
      },
    }),
    )
  } catch (error) {
    if (error instanceof ResponseError && error.response.status === 401) {
      throw new Error('Identifiants invalides.')
    }

    throw error
  }
}

export const logoutAdmin = async (): Promise<void> => {
  await adminAuthApi.logoutAdmin()
}
