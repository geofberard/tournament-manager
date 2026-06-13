import { useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useSWRConfig } from 'swr'
import { ManageTeamForm } from '../../components/admin/ManageTeamForm'
import { TeamList } from '../../components/admin/TeamList'
import { useTeams } from '../../hooks/useTeams'
import {
  createTeam,
  deleteTeam,
  updateTeam,
  type Team,
  type TeamPayload,
} from '../../services/teamsService'

type TeamDrawerMode = 'idle' | 'create' | 'update'

const emptyTeamForm: TeamPayload = { name: '' }

const sortTeamsByName = (teams: Team[]) =>
  [...teams].sort((teamA, teamB) => teamA.name.localeCompare(teamB.name, 'fr'))

export const AdminTeamsView = () => {
  const { teams, isLoading, errorMessage } = useTeams()
  const { mutate } = useSWRConfig()
  const [drawerMode, setDrawerMode] = useState<TeamDrawerMode>('idle')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const closeDrawer = () => {
    setDrawerMode('idle')
    setSelectedTeam(null)
  }

  const openCreateDrawer = () => {
    setSelectedTeam(null)
    setDrawerMode('create')
  }

  const openUpdateDrawer = (team: Team) => {
    setSelectedTeam(team)
    setDrawerMode('update')
  }

  const saveCreatedTeam = async (teamPayload: TeamPayload) => {
    const newTeam = await createTeam(teamPayload)
    await mutate(
      '/api/teams',
      (currentTeams: Team[] | undefined) => sortTeamsByName([...(currentTeams ?? []), newTeam]),
      { revalidate: false },
    )
    closeDrawer()
  }

  const saveUpdatedTeam = async (teamPayload: TeamPayload) => {
    if (!selectedTeam) {
      return
    }

    const updatedTeam = await updateTeam(selectedTeam.id, teamPayload)
    await mutate(
      '/api/teams',
      (currentTeams: Team[] | undefined) =>
        sortTeamsByName((currentTeams ?? []).map((team) => (team.id === updatedTeam.id ? updatedTeam : team))),
      { revalidate: false },
    )
    closeDrawer()
  }

  const deleteSelectedTeam = async (teamToDelete: Team) => {
    await deleteTeam(teamToDelete.id)
    await mutate(
      '/api/teams',
      (currentTeams: Team[] | undefined) => (currentTeams ?? []).filter((team) => team.id !== teamToDelete.id),
      { revalidate: false },
    )

    if (selectedTeam?.id === teamToDelete.id) {
      closeDrawer()
    }
  }

  return (
    <Stack spacing={3}>
      <Stack alignItems={{ xs: 'stretch', sm: 'flex-start' }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography variant="h1">Equipes</Typography>
          <Typography color="text.secondary">
            Gerez les equipes qui participent au tournoi.
          </Typography>
        </Stack>
        <Button onClick={openCreateDrawer} variant="contained">
          Ajouter une equipe
        </Button>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : teams.length === 0 ? (
        <Alert severity="info">Aucune equipe disponible.</Alert>
      ) : (
        <TeamList onDelete={deleteSelectedTeam} onEdit={openUpdateDrawer} teams={teams} />
      )}

      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        onClose={closeDrawer}
        open={drawerMode !== 'idle'}
        PaperProps={{
          sx: {
            borderTopLeftRadius: { xs: 8, sm: 0 },
            borderTopRightRadius: { xs: 8, sm: 0 },
            height: { xs: '88vh', sm: '100%' },
            width: { xs: '100%', sm: 520 },
          },
        }}
      >
        {drawerMode === 'create' ? (
          <ManageTeamForm
            initialValue={emptyTeamForm}
            onClose={closeDrawer}
            onSubmit={saveCreatedTeam}
            titleLabel="Nouvelle equipe"
          />
        ) : null}
        {drawerMode === 'update' && selectedTeam ? (
          <ManageTeamForm
            initialValue={{ name: selectedTeam.name }}
            onClose={closeDrawer}
            onSubmit={saveUpdatedTeam}
            titleLabel="Modifier l'equipe"
          />
        ) : null}
      </Drawer>
    </Stack>
  )
}
