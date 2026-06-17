import { describe, expect, it } from 'vitest'
import { AlertContext } from './AlertContext'

describe('AlertContext', () => {
  it('should expose a React context provider', () => {
    expect(AlertContext).toBeDefined()
    expect(AlertContext.Provider).toBeDefined()
  })
})
