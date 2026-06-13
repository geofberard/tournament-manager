import { describe, expect, it } from 'vitest'
import { ResponseError } from '../generated/api-client/runtime'
import { getApiErrorCode, UserFacingError } from './apiError'

describe('apiError', () => {
  it('should read the error code from an API response', async () => {
    // GIVEN
    const error = new ResponseError(
      new Response(JSON.stringify({ code: 'TEAM_IN_USE', message: 'Team in use' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 409,
      }),
    )

    // WHEN
    const code = await getApiErrorCode(error)

    // THEN
    expect(code).toBe('TEAM_IN_USE')
  })

  it('should return null for a non API error', async () => {
    // WHEN
    const code = await getApiErrorCode(new Error('Boom'))

    // THEN
    expect(code).toBeNull()
  })

  it('should identify user-facing errors', () => {
    // WHEN
    const error = new UserFacingError('Explication lisible')

    // THEN
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('UserFacingError')
  })
})
