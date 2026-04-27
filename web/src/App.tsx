import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { listTeams, type Team } from './lib/apiClient'

function App() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTeams = async () => {
      try {
        const loadedTeams = await listTeams()
        if (!isMounted) {
          return
        }

        setTeams(loadedTeams)
        setErrorMessage(null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Le chargement des equipes a echoue.'
        setErrorMessage(message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        py: { xs: 4, md: 8 },
        background:
          'radial-gradient(circle at top, rgba(21,101,192,0.12), transparent 36%), linear-gradient(180deg, #f7faff 0%, #f4f7fb 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              background:
                'linear-gradient(135deg, rgba(21,101,192,0.10), rgba(0,137,123,0.08))',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={2}>
                <Chip
                  label="Tournament Manager"
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: 'flex-start' }}
                />
                <Typography variant="h1" component="h1">
                  Equipes du tournoi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  La liste ci-dessous est chargee via le client TypeScript
                  genere a partir du contrat OpenAPI.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={3} aria-live="polite">
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Typography variant="h5">Liste des equipes</Typography>
                  <Chip
                    label={`${teams.length} equipe${teams.length > 1 ? 's' : ''}`}
                    color="secondary"
                    variant="filled"
                  />
                </Stack>

                <Divider />

                {isLoading ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={24} />
                    <Typography>Chargement des equipes...</Typography>
                  </Stack>
                ) : null}

                {errorMessage ? (
                  <Alert severity="error">{errorMessage}</Alert>
                ) : null}

                {!isLoading && !errorMessage ? (
                  <List disablePadding>
                    {teams.map((team, index) => (
                      <ListItem
                        key={team.id}
                        disableGutters
                        secondaryAction={<Chip label={team.id} variant="outlined" />}
                        sx={{
                          px: 2,
                          py: 1.5,
                          mb: 1.5,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <ListItemText
                          primary={team.name}
                          secondary={`Equipe ${index + 1}`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
