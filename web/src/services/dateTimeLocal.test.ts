import { describe, expect, it } from 'vitest'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from './dateTimeLocal'

describe('dateTimeLocal', () => {
  it('should format an existing date for a datetime-local input', () => {
    // GIVEN
    const date = new Date(2026, 4, 3, 10, 30)

    // WHEN / THEN
    expect(toDateTimeLocalValue(date)).toBe('2026-05-03T10:30')
  })

  it('should return an empty input value when the date is missing', () => {
    // WHEN / THEN
    expect(toDateTimeLocalValue(null)).toBe('')
    expect(toDateTimeLocalValue(undefined)).toBe('')
  })

  it('should parse an input value as a local date or clear it when empty', () => {
    // WHEN
    const date = fromDateTimeLocalValue('2026-05-03T10:30')

    // THEN
    expect(date).toBeInstanceOf(Date)
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(4)
    expect(date?.getDate()).toBe(3)
    expect(date?.getHours()).toBe(10)
    expect(date?.getMinutes()).toBe(30)
    expect(fromDateTimeLocalValue('')).toBeUndefined()
  })
})
