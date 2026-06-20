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
import type { AppRoute } from '../../app/routes'

type NavigationMenuProps = {
  actionIcon?: React.ReactNode
  actionLabel: string
  currentPath: string
  logoAlt?: string
  logoSrc?: string
  onActionClick: () => void
  onNavigate: (path: string) => void
  pages: AppRoute[]
  subtitle?: string
  title: string
}

const BurgerButton = ({ onClick }: { onClick: () => void }) => {
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

export const NavigationMenu = ({
  actionIcon,
  actionLabel,
  currentPath,
  logoAlt,
  logoSrc,
  onActionClick,
  onNavigate,
  pages,
  subtitle,
  title,
}: NavigationMenuProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleNavigate = (path: string) => {
    onNavigate(path)
    closeMobileMenu()
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ px: { xs: 2, md: 3 }, py: 1.5 }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <BurgerButton onClick={() => setMobileMenuOpen(true)} />
          {logoSrc ? (
            <Box
              component="img"
              src={logoSrc}
              alt={logoAlt ?? ''}
              sx={{ width: { xs: 44, md: 56 }, display: 'block' }}
            />
          ) : null}
          <Box>
            <Typography variant="h3">{title}</Typography>
            {subtitle ? (
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {pages.map((page) => {
            const isActive = page.path === currentPath

            return (
              <Button
                key={page.path}
                color="inherit"
                variant="outlined"
                onClick={() => onNavigate(page.path)}
                sx={{
                  borderColor: isActive ? 'secondary.main' : 'transparent',
                  color: 'inherit',
                  '&:hover': {
                    borderColor: isActive ? 'secondary.main' : 'transparent',
                  },
                }}
              >
                {page.label}
              </Button>
            )
          })}
        </Stack>

        <Button
          aria-label={actionLabel}
          variant="outlined"
          color="secondary"
          onClick={onActionClick}
          sx={{
            minWidth: actionIcon ? { xs: 44, md: 64 } : undefined,
            px: actionIcon ? { xs: 1.25, md: 2 } : undefined,
            gap: actionIcon ? 1 : undefined,
          }}
        >
          {actionIcon ? <Box component="span" sx={{ display: 'inline-flex' }}>{actionIcon}</Box> : null}
          <Box component="span" sx={{ display: actionIcon ? { xs: 'none', md: 'inline' } : 'inline' }}>
            {actionLabel}
          </Box>
        </Button>
      </Stack>

      <Drawer anchor="left" open={isMobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ px: 2, py: 2.5, backgroundColor: 'primary.dark', color: 'primary.contrastText' }}>
            <Typography variant="h3">Navigation</Typography>
            {subtitle ? (
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>

          <List sx={{ py: 1 }}>
            {pages.map((page) => (
              <ListItemButton
                key={page.path}
                selected={page.path === currentPath}
                onClick={() => handleNavigate(page.path)}
              >
                <ListItemText primary={page.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 'auto', p: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={onActionClick}
              startIcon={actionIcon}
            >
              {actionLabel}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}
