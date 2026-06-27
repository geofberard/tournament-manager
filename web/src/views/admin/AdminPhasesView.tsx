import { useState } from 'react'
import {
  Alert,
  CircularProgress,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { useSWRConfig } from 'swr'
import { AdminCreateFab } from '../../components/admin/AdminCreateFab'
import { ManagePhaseForm } from '../../components/admin/ManagePhaseForm'
import { PhaseTreeRoot } from '../../components/admin/PhaseTreeRoot'
import { usePhaseTree } from '../../hooks/usePhaseTree'
import { createPhase, deletePhase, updatePhase, type Phase, type PhasePayload } from '../../services/phasesService'

type PhaseDrawerMode = 'idle' | 'create' | 'update'

const emptyPhaseForm: PhasePayload = {
  details: '',
  name: '',
  order: 1,
  parentId: undefined,
  type: undefined,
}

const toPhasePayload = (phase: Phase): PhasePayload => ({
  details: phase.details ?? '',
  name: phase.name,
  order: phase.order,
  parentId: phase.parentId,
  type: phase.type,
})

export const AdminPhasesView = () => {
  const { phaseTree, isLoading, errorMessage } = usePhaseTree()
  const { mutate } = useSWRConfig()
  const [drawerMode, setDrawerMode] = useState<PhaseDrawerMode>('idle')
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const closeDrawer = () => {
    setDrawerMode('idle')
    setSelectedPhase(null)
  }

  const openCreateDrawer = () => {
    setSelectedPhase(null)
    setDrawerMode('create')
  }

  const openUpdateDrawer = (phase: Phase) => {
    setSelectedPhase(phase)
    setDrawerMode('update')
  }

  const saveCreatedPhase = async (phasePayload: PhasePayload) => {
    const newPhase = await createPhase(phasePayload)
    await mutate('/api/phases', (currentPhases: Phase[] | undefined) => [...(currentPhases ?? []), newPhase], {
      revalidate: false,
    })
    closeDrawer()
  }

  const saveUpdatedPhase = async (phasePayload: PhasePayload) => {
    if (!selectedPhase) {
      return
    }

    const updatedPhase = await updatePhase(selectedPhase.id, phasePayload)
    await mutate(
      '/api/phases',
      (currentPhases: Phase[] | undefined) =>
        (currentPhases ?? []).map((phase) => (phase.id === updatedPhase.id ? updatedPhase : phase)),
      { revalidate: false },
    )
    closeDrawer()
  }

  const deleteSelectedPhase = async (phase: Phase) => {
    await deletePhase(phase.id)
    await mutate(
      '/api/phases',
      (currentPhases: Phase[] | undefined) =>
        (currentPhases ?? []).filter((currentPhase) => currentPhase.id !== phase.id),
      { revalidate: false },
    )
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" gap={1.5}>
        <AccountTreeIcon fontSize="large" />
        <Typography variant="h1">Phases</Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : phaseTree.length === 0 ? (
        <Alert severity="info">Aucune phase disponible.</Alert>
      ) : (
        <PhaseTreeRoot
          nodes={phaseTree}
          onDelete={deleteSelectedPhase}
          onEdit={openUpdateDrawer}
        />
      )}

      <AdminCreateFab label="Ajouter une phase" onClick={openCreateDrawer} />

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
          <ManagePhaseForm
            initialValue={emptyPhaseForm}
            onClose={closeDrawer}
            onSubmit={saveCreatedPhase}
            phaseTree={phaseTree}
            titleLabel="Nouvelle phase"
          />
        ) : null}
        {drawerMode === 'update' && selectedPhase ? (
          <ManagePhaseForm
            currentPhaseId={selectedPhase.id}
            initialValue={toPhasePayload(selectedPhase)}
            onClose={closeDrawer}
            onSubmit={saveUpdatedPhase}
            phaseTree={phaseTree}
            titleLabel="Modifier la phase"
          />
        ) : null}
      </Drawer>
    </Stack>
  )
}
