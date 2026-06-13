import type { ErrorResponse } from '../generated/api-client'
import { ResponseError } from '../generated/api-client/runtime'

export class UserFacingError extends Error {
  override name = 'UserFacingError'
}

export const getApiErrorCode = async (error: unknown): Promise<string | null> => {
  if (!(error instanceof ResponseError)) {
    return null
  }

  try {
    const errorResponse = await error.response.json() as ErrorResponse
    return errorResponse.code
  } catch {
    return null
  }
}
