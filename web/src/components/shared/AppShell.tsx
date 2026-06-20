import { Box } from '@mui/material'
import { NavigationMenu } from './NavigationMenu'
import type { AppRoute } from '../../app/routes'

type AppShellProps = {
  actionIcon?: React.ReactNode
  actionLabel: string
  children: React.ReactNode
  currentPath: string
  logoAlt?: string
  logoSrc?: string
  onActionClick: () => void
  onNavigate: (path: string) => void
  pages: AppRoute[]
  subtitle?: string
  title: string
}

export const AppShell = ({
  actionIcon,
  actionLabel,
  children,
  currentPath,
  logoAlt,
  logoSrc,
  onActionClick,
  onNavigate,
  pages,
  subtitle,
  title,
}: AppShellProps) => {
  const contentMaxWidth = 1200

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
        <Box sx={{ maxWidth: contentMaxWidth, mx: 'auto', width: '100%' }}>
          <NavigationMenu
            title={title}
            subtitle={subtitle}
            pages={pages}
            currentPath={currentPath}
            onNavigate={onNavigate}
            actionIcon={actionIcon}
            actionLabel={actionLabel}
            onActionClick={onActionClick}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
          />
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          maxWidth: contentMaxWidth,
          mx: 'auto',
          width: '100%',
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
