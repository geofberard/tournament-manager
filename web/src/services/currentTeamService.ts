import type { Team } from './teamsService'

const CURRENT_TEAM_KEY = 'team'
const CURRENT_TEAM_LIFETIME_DAYS = 10

const readCookie = (key: string): string | null => {
  const prefix = `${key}=`
  const cookies = decodeURIComponent(document.cookie).split(';')

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim()
    if (cookie.startsWith(prefix)) {
      return cookie.slice(prefix.length)
    }
  }

  return null
}

const writeCookie = (key: string, value: string | null, lifetimeInDays: number) => {
  const expiresAt = new Date()
  expiresAt.setTime(expiresAt.getTime() + lifetimeInDays * 24 * 60 * 60 * 1000)

  document.cookie = `${key}=${value ?? ''};expires=${expiresAt.toUTCString()};path=/`
}

const parseTeam = (value: string | null): Team | null => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as Team
  } catch {
    return null
  }
}

export const getCurrentTeam = (): Team | null => {
  const storedTeam = parseTeam(window.localStorage.getItem(CURRENT_TEAM_KEY))
  if (storedTeam) {
    return storedTeam
  }

  const cookieTeam = parseTeam(readCookie(CURRENT_TEAM_KEY))
  if (cookieTeam) {
    window.localStorage.setItem(CURRENT_TEAM_KEY, JSON.stringify(cookieTeam))
  }

  return cookieTeam
}

export const setCurrentTeam = (team: Team) => {
  const serializedTeam = JSON.stringify(team)

  window.localStorage.setItem(CURRENT_TEAM_KEY, serializedTeam)
  writeCookie(CURRENT_TEAM_KEY, serializedTeam, CURRENT_TEAM_LIFETIME_DAYS)
}

export const clearCurrentTeam = () => {
  window.localStorage.removeItem(CURRENT_TEAM_KEY)
  writeCookie(CURRENT_TEAM_KEY, null, -1)
}
