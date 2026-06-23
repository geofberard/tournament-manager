import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import {
  Alert,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useSWRConfig } from 'swr'
import { AdminCreateSpeedDial } from '../../components/admin/AdminCreateSpeedDial'
import { BulkCreateTeamsForm } from '../../components/admin/BulkCreateTeamsForm'
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

type TeamDrawerMode = 'idle' | 'bulk-create' | 'create' | 'update'

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

  const openCreateDrawer = (mode: 'bulk-create' | 'create') => {
    setSelectedTeam(null)
    setDrawerMode(mode)
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

  const saveCreatedTeams = async (teamNames: string[]) => {
    const creationResults = await Promise.allSettled(
      teamNames.map((name) => createTeam({ name })),
    )
    const createdTeams = creationResults.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : [],
    )
    const failedNames = teamNames.filter(
      (_name, index) => creationResults[index].status === 'rejected',
    )

    if (createdTeams.length > 0) {
      await mutate(
        '/api/teams',
        (currentTeams: Team[] | undefined) =>
          sortTeamsByName([...(currentTeams ?? []), ...createdTeams]),
        { revalidate: false },
      )
    }

    if (failedNames.length === 0) closeDrawer()
    return failedNames
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
      <Stack spacing={1}>
        <Typography variant="h1">Équipes</Typography>
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

      <AdminCreateSpeedDial
        actions={[
          {
            icon: <AddIcon />,
            label: 'Créer une équipe',
            onClick: () => openCreateDrawer('create'),
          },
          {
            icon: <PlaylistAddIcon />,
            label: 'Créer plusieurs équipes',
            onClick: () => openCreateDrawer('bulk-create'),
          },
        ]}
        label="Ajouter des équipes"
      />

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
        {drawerMode === 'bulk-create' ? (
          <BulkCreateTeamsForm onClose={closeDrawer} onSubmit={saveCreatedTeams} />
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
