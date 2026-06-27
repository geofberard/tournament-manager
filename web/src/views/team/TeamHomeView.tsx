import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import MapIcon from '@mui/icons-material/Map'
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball'
import { Link as RouterLink } from 'react-router-dom'
import {
  TEAM_BUVETTE_PATH,
  TEAM_GAMES_PATH,
  TEAM_RESULTS_PATH,
  TEAM_TERRAINS_PATH,
  teamRoutes,
} from '../../app/routes'
import type { Team } from '../../services/teamsService'

type TeamHomeViewProps = {
  currentTeam: Team
}

const sections = [
  {
    description:
      "Retrouvez les matchs à venir, les matchs en cours, les rencontres terminées et vos arbitrages.",
    icon: <SportsVolleyballIcon color="primary" fontSize="large" />,
    path: TEAM_GAMES_PATH,
  },
  {
    description:
      "Consultez les classements par phase, les poules de votre équipe et les résultats déjà enregistrés.",
    icon: <EmojiEventsIcon color="primary" fontSize="large" />,
    path: TEAM_RESULTS_PATH,
  },
  {
    description:
      "Repérez rapidement les terrains et vérifiez où se jouent les prochaines rencontres.",
    icon: <MapIcon color="primary" fontSize="large" />,
    path: TEAM_TERRAINS_PATH,
  },
  {
    description:
      "Gardez le menu de la buvette sous la main pendant la journée du tournoi.",
    icon: <LocalDiningIcon color="primary" fontSize="large" />,
    path: TEAM_BUVETTE_PATH,
  },
].map((section) => ({
  ...section,
  label: teamRoutes.find((route) => route.path === section.path)?.label ?? '',
}))

export const TeamHomeView = ({ currentTeam }: TeamHomeViewProps) => (
  <Stack spacing={3}>
    <Stack spacing={0.75}>
      <Typography variant="h1">Bienvenue {currentTeam.name}</Typography>
      <Typography color="text.secondary">
        Retrouvez ici les raccourcis utiles pour suivre votre tournoi.
      </Typography>
    </Stack>

    <Stack
      component="section"
      aria-label="Sections équipe"
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {sections.map((section) => (
        <Card key={section.path} variant="outlined" sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" gap={1.25}>
                {section.icon}
                <Typography variant="h2">{section.label}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography color="text.secondary">{section.description}</Typography>
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
            <Button
              component={RouterLink}
              endIcon={<ArrowForwardIcon />}
              to={section.path}
              variant="contained"
            >
              Ouvrir {section.label.toLowerCase()}
            </Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  </Stack>
)
