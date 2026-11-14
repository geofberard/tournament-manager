import { Box, ButtonBase, Dialog, IconButton, Typography } from '@mui/material'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import RemoveIcon from '@mui/icons-material/Remove'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball'
import { alpha, type Theme } from '@mui/material/styles'
import type { Team } from '../../services/apiClient'

type FullscreenScoreboardProps = {
  contestants: Team[]
  switchSides: boolean
  scores: Record<string, number>
  lastTeamPoint: string | null
  onChangeScore: (teamId: string, delta: number) => void
  onSwitchSides: () => void
  onClose: () => void
}

const TEAM_PALETTES = ['primary', 'secondary'] as const

const overlayButtonSx = (theme: Theme) => ({
  color: theme.palette.text.primary,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
  },
})

const TITLE_MAX_LINES = 2
const TITLE_LINE_HEIGHT = 1.2

const inset = (side: 'top' | 'right' | 'bottom' | 'left') =>
  `calc(env(safe-area-inset-${side}, 0px) + 16px)`

const horizontalPadding =
  'calc(max(env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)) + 16px)'

const blockSafeAreaPadding = (index: number) => {
  const isFirst = index === 0
  return {
    pt: isFirst ? inset('top') : 2,
    pb: isFirst ? 2 : inset('bottom'),
    px: horizontalPadding,
    '@media (orientation: landscape)': {
      pt: inset('top'),
      pb: inset('bottom'),
    },
  }
}

export const FullscreenScoreboard = ({
  contestants,
  switchSides,
  scores,
  lastTeamPoint,
  onChangeScore,
  onSwitchSides,
  onClose,
}: FullscreenScoreboardProps) => {
  const teams = contestants.slice(0, 2)
  const orderedTeams = switchSides ? teams.toReversed() : teams

  return (
    <Dialog
      open
      fullScreen
      onClose={onClose}
      aria-label="Tableau des scores en plein écran"
      slotProps={{
        paper: {
          sx: {
            overflow: 'hidden',
            touchAction: 'manipulation',
            overscrollBehavior: 'none',
          },
        },
      }}
    >
      <Box
        data-testid="fullscreen-scoreboard"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '@media (orientation: landscape)': {
            flexDirection: 'row',
          },
        }}
      >
        <IconButton
          aria-label="Quitter le mode plein écran"
          onClick={onClose}
          sx={[{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
            zIndex: 2,
          }, overlayButtonSx]}
        >
          <FullscreenExitIcon fontSize="large" />
        </IconButton>

        <IconButton
          aria-label="Changer de côté"
          onClick={onSwitchSides}
          sx={[{
            position: 'absolute',
            zIndex: 2,
            bottom: inset('bottom'),
            left: inset('left'),
            '@media (orientation: landscape)': {
              left: '50%',
              transform: 'translateX(-50%)',
            },
            width: 48,
            height: 48,
          }, overlayButtonSx]}
        >
          <SwapHorizIcon fontSize="large" />
        </IconButton>

        {orderedTeams.map((team, index) => {
          const score = scores[team.id] ?? 0
          const hasLastPoint = lastTeamPoint === team.id
          const palette = TEAM_PALETTES[teams.indexOf(team) % TEAM_PALETTES.length]

          return (
            <Box
              key={team.id}
              data-testid={`scoreboard-block-${team.id}`}
              sx={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                minHeight: 0,
                minWidth: 0,
                bgcolor: `${palette}.main`,
                color: `${palette}.contrastText`,
              }}
            >
              <ButtonBase
                aria-label={`Ajouter un point à ${team.name}`}
                onClick={() => onChangeScore(team.id, 1)}
                sx={{ position: 'absolute', inset: 0 }}
              />
              
              <Box
                sx={{
                  position: 'relative',
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  ...blockSafeAreaPadding(index),
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    flexShrink: 0,
                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                    height: `${TITLE_MAX_LINES * TITLE_LINE_HEIGHT}em`,
                    display: 'grid',
                    gridTemplateColumns: 'minmax(56px, 1fr) auto minmax(56px, 1fr)',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1 }}>
                    {hasLastPoint ? (
                      <SportsVolleyballIcon
                        data-testid={`last-point-${team.id}`}
                        sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }}
                      />
                    ) : null}
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      fontSize: 'inherit',
                      lineHeight: TITLE_LINE_HEIGHT,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: TITLE_MAX_LINES,
                      overflow: 'hidden',
                    }}
                  >
                    {team.name}
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  component="div"
                  data-testid={`score-${team.id}`}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 900,
                    fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {score}
                </Typography>

                <IconButton
                  aria-label={`Retirer un point à ${team.name}`}
                  onClick={() => onChangeScore(team.id, -1)}
                  disabled={score === 0}
                  sx={(theme) => ({
                    pointerEvents: 'auto',
                    width: 48,
                    height: 48,
                    color: theme.palette[palette].contrastText,
                    backgroundColor: alpha(theme.palette[palette].contrastText, 0.15),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette[palette].contrastText, 0.3),
                    },
                    '&.Mui-disabled': {
                      color: alpha(theme.palette[palette].contrastText, 0.4),
                    },
                  })}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Dialog>
  )
}
