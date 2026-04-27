import { useEffect, useState } from 'react'
import { Alert, Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from '@mui/material'
import { LoadingState } from '../components/LoadingState'
import { PageHeader } from '../components/PageHeader'
import { TeamList } from '../components/TeamList'
import { listTeams, type Team } from '../services/teamsService'

export function TeamsView() {
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
          <PageHeader />

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

                {isLoading ? <LoadingState message="Chargement des equipes..." /> : null}

                {errorMessage ? (
                  <Alert severity="error">{errorMessage}</Alert>
                ) : null}

                {!isLoading && !errorMessage ? <TeamList teams={teams} /> : null}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
