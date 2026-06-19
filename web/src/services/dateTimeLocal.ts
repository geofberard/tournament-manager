export const toDateTimeLocalValue = (date?: Date | null) => {
  if (!date) return ''

  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export const fromDateTimeLocalValue = (value: string) => (value ? new Date(value) : undefined)
