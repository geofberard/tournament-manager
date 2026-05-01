import { useState } from 'react'
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import scufLogo from '../../assets/scuf-logo.svg'
import type { Team } from '../../services/teamsService'
import type { AppRoute } from '../../app/routes'

type TeamAppShellProps = {
  children: React.ReactNode
  currentPath: string
  currentTeam: Team
  onChangeTeam: () => void
  onNavigate: (path: string) => void
  routes: AppRoute[]
}

function BurgerButton({ onClick }: { onClick: () => void }) {
  return (
    <ButtonBase
      aria-label="Ouvrir le menu"
      onClick={onClick}
      sx={{
        display: { xs: 'inline-flex', md: 'none' },
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0.5,
        width: 44,
        height: 44,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.2)',
      }}
    >
      {[0, 1, 2].map((line) => (
        <Box
          key={line}
          sx={{
            width: 18,
            height: 2,
            borderRadius: 999,
            backgroundColor: 'currentColor',
          }}
        />
      ))}
    </ButtonBase>
  )
}

export function TeamAppShell({
  children,
  currentPath,
  currentTeam,
  onChangeTeam,
  onNavigate,
  routes,
}: TeamAppShellProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleNavigate = (path: string) => {
    onNavigate(path)
    closeMobileMenu()
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'primary.dark',
          color: 'primary.contrastText',
          borderBottom: (theme) => `4px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: { xs: 2, md: 3 }, py: 1.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BurgerButton onClick={() => setMobileMenuOpen(true)} />
            <Box
              component="img"
              src={scufLogo}
              alt="SCUF"
              sx={{ width: { xs: 44, md: 56 }, display: 'block' }}
            />
            <Box>
              <Typography variant="h3">Espace équipe</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {currentTeam.name}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            {routes.map((route) => {
              const isActive = route.path === currentPath

              return (
                <Button
                  key={route.path}
                  color="inherit"
                  variant={isActive ? 'outlined' : 'text'}
                  onClick={() => onNavigate(route.path)}
                  sx={{
                    borderColor: isActive ? 'secondary.main' : 'transparent',
                    color: 'inherit',
                  }}
                >
                  {route.label}
                </Button>
              )
            })}
          </Stack>

          <Button variant="outlined" color="secondary" onClick={onChangeTeam}>
            Changer d'équipe
          </Button>
        </Stack>
      </Box>

      <Drawer anchor="left" open={isMobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ px: 2, py: 2.5, backgroundColor: 'primary.dark', color: 'primary.contrastText' }}>
            <Typography variant="h3">Navigation</Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              {currentTeam.name}
            </Typography>
          </Box>

          <List sx={{ py: 1 }}>
            {routes.map((route) => (
              <ListItemButton
                key={route.path}
                selected={route.path === currentPath}
                onClick={() => handleNavigate(route.path)}
              >
                <ListItemText primary={route.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 'auto', p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Button fullWidth variant="outlined" color="secondary" onClick={onChangeTeam}>
              Changer d'équipe
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Box component="main" sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
        {children}
      </Box>
    </Box>
  )
}
