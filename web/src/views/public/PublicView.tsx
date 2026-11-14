import { useEffect, useState } from 'react'
import { Alert, BottomNavigation, BottomNavigationAction, Box, Paper, Stack, Typography } from '@mui/material'
import StadiumIcon from '@mui/icons-material/Stadium'
import EventNoteIcon from '@mui/icons-material/EventNote'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'
import scufLogo from '../../assets/scuf-logo.svg'
import qrCodeImage from '../../assets/qrcode.png'
import { usePhases } from '../../hooks/usePhases'
import { useKioskMode } from '../../hooks/usePublicLayout'
import { PUBLIC_REFRESH_INTERVAL } from '../../services/courtSchedule'
import { PUBLIC_GAMES_PATH, PUBLIC_HOME_PATH, PUBLIC_INFO_PATH, PUBLIC_RANKINGS_PATH } from '../../app/routes'

const KIOSK_IDLE_TIMEOUT = 60_000

const publicTabs = [
  { label: 'Terrains', path: PUBLIC_HOME_PATH, icon: <StadiumIcon /> },
  { label: 'Matchs', path: PUBLIC_GAMES_PATH, icon: <EventNoteIcon /> },
  { label: 'Classements', path: PUBLIC_RANKINGS_PATH, icon: <EmojiEventsIcon /> },
  { label: 'Infos', path: PUBLIC_INFO_PATH, icon: <InfoOutlinedIcon /> },
]

const getCurrentTabPath = (pathname: string) =>
  publicTabs.find((tab) => tab.path !== PUBLIC_HOME_PATH && pathname.startsWith(tab.path))?.path ?? PUBLIC_HOME_PATH

const PublicContent = () => {
  const { phases, isLoading, errorMessage } = usePhases()
  const isTournamentMissing = !isLoading && !errorMessage && phases.length === 0

  if (isTournamentMissing) {
    return <Alert severity="info" variant="outlined">Aucun tournoi n'est configuré pour le moment.</Alert>
  }

  return <Outlet />
}

const useKioskIdleReturn = (enabled: boolean) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [lastInteraction, setLastInteraction] = useState(0)

  useEffect(() => {
    if (!enabled || location.pathname === PUBLIC_HOME_PATH) return undefined
    const timeout = window.setTimeout(() => navigate(PUBLIC_HOME_PATH), KIOSK_IDLE_TIMEOUT)
    return () => window.clearTimeout(timeout)
  }, [enabled, location.pathname, lastInteraction, navigate])

  return () => setLastInteraction(Date.now())
}

export const PublicView = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isKioskMode = useKioskMode()
  const registerInteraction = useKioskIdleReturn(isKioskMode)
  const currentTabPath = getCurrentTabPath(location.pathname)
  const currentTabIndex = publicTabs.findIndex((tab) => tab.path === currentTabPath)

  return (
    <SWRConfig value={{ refreshInterval: PUBLIC_REFRESH_INTERVAL }}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }} onPointerDown={registerInteraction}>
        <Box
          component="header"
          sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'primary.main', color: 'primary.contrastText' }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: 1.5, md: 2 }}
            sx={{
              maxWidth: 1600,
              mx: 'auto',
              px: { xs: 2, md: 3 },
              pt: 'calc(12px + env(safe-area-inset-top))',
              pb: 1.5,
            }}
          >
            <Box component="img" src={scufLogo} alt="SCUF" sx={{ height: { xs: 36, md: 44 } }} />
            <Typography fontWeight={700} sx={{ flex: 1, typography: { xs: 'h6', md: 'h5' } }}>
              Suivi du tournoi
            </Typography>
            <Stack direction="row" alignItems="center" gap={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography fontWeight={700}>Suivez le tournoi sur votre téléphone</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Scannez le QR code</Typography>
              </Box>
              <Box
                component="img"
                src={qrCodeImage}
                alt="QR Code du tournoi"
                sx={{ height: 72, width: 72, bgcolor: 'common.white', borderRadius: 1, p: 0.5 }}
              />
            </Stack>
          </Stack>
        </Box>

        <Box
          component="main"
          sx={{
            maxWidth: 1600,
            mx: 'auto',
            px: { xs: 2, md: 3 },
            pt: { xs: 2, md: 3 },
            pb: { xs: 'calc(104px + env(safe-area-inset-bottom))', md: 'calc(120px + env(safe-area-inset-bottom))' },
          }}
        >
          <PublicContent />
        </Box>

        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            zIndex: 10,
            bottom: 'calc(12px + env(safe-area-inset-bottom))',
            left: 12,
            right: 12,
            mx: 'auto',
            maxWidth: { xs: 520, md: 760 },
            borderRadius: 999,
            overflow: 'hidden',
            p: 0.75,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              aria-hidden
              data-testid="active-tab-indicator"
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: `${100 / publicTabs.length}%`,
                borderRadius: 999,
                bgcolor: 'primary.main',
                transform: `translateX(${currentTabIndex * 100}%)`,
                transition: theme.transitions.create('transform', {
                  duration: 350,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }),
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              })}
            />
            <BottomNavigation
              showLabels
              value={currentTabPath}
              onChange={(_event, path: string) => navigate(path)}
              aria-label="Sections du tournoi"
              sx={{ position: 'relative', height: { xs: 60, md: 72 }, bgcolor: 'transparent' }}
            >
              {publicTabs.map((tab) => (
                <BottomNavigationAction
                  key={tab.path}
                  value={tab.path}
                  label={tab.label}
                  icon={tab.icon}
                  sx={(theme) => ({
                    minWidth: 0,
                    maxWidth: 'none',
                    borderRadius: 999,
                    color: 'text.secondary',
                    transition: theme.transitions.create('color', { duration: 350 }),
                    '& .MuiSvgIcon-root': { transition: theme.transitions.create('color', { duration: 350 }) },
                    '& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected': {
                      fontSize: 12,
                      fontWeight: 600,
                    },
                    '&.Mui-selected': { color: 'primary.contrastText' },
                    '&.Mui-selected .MuiSvgIcon-root': { color: 'secondary.main' },
                    [theme.breakpoints.up('md')]: {
                      '& .MuiSvgIcon-root': { fontSize: 30 },
                      '& .MuiBottomNavigationAction-label, & .MuiBottomNavigationAction-label.Mui-selected': { fontSize: 15 },
                    },
                  })}
                />
              ))}
            </BottomNavigation>
          </Box>
        </Paper>
      </Box>
    </SWRConfig>
  )
}
