import { useEffect } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { usePersistedState } from './usePersistedState'

export const KIOSK_MODE_STORAGE_KEY = 'public-kiosk-mode'
export const KIOSK_MODE_SEARCH_PARAM = 'borne'

const DISABLED_VALUES = new Set(['off', 'non', 'false', '0'])

export function usePublicLayout() {
  const theme = useTheme()

  return { isLargeScreen: useMediaQuery(theme.breakpoints.up('md')) }
}

export function useKioskMode() {
  const [searchParams] = useSearchParams()
  const [isKioskMode, setIsKioskMode] = usePersistedState(KIOSK_MODE_STORAGE_KEY, false)
  const requestedValue = searchParams.get(KIOSK_MODE_SEARCH_PARAM)

  useEffect(() => {
    if (requestedValue === null) return
    setIsKioskMode(!DISABLED_VALUES.has(requestedValue.toLowerCase()))
  }, [requestedValue, setIsKioskMode])

  return isKioskMode
}
