import type { SyntheticEvent } from 'react'
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
import { ManagePhaseForm } from '../../components/admin/ManagePhaseForm'
import { PhaseAccordion } from '../../components/admin/PhaseAccordion'
import { usePhases } from '../../hooks/usePhases'
import { createPhase, updatePhase, type Phase, type PhasePayload } from '../../services/phasesService'

type PhaseDrawerMode = 'idle' | 'create' | 'update'

const emptyPhaseForm: PhasePayload = {
  details: '',
  name: '',
  order: 1,
  type: 'POOL',
}

const toPhasePayload = (phase: Phase): PhasePayload => ({
  details: phase.details ?? '',
  name: phase.name,
  order: phase.order,
  type: phase.type,
})

export const AdminPhasesView = () => {
  const { phases, isLoading, errorMessage } = usePhases()
  const { mutate } = useSWRConfig()
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | false>(false)
  const [drawerMode, setDrawerMode] = useState<PhaseDrawerMode>('idle')
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleAccordionChange = (phaseId: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpandedPhaseId(isExpanded ? phaseId : false)
  }

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
    setExpandedPhaseId(newPhase.id)
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
    setExpandedPhaseId(updatedPhase.id)
    closeDrawer()
  }

  return (
    <Stack spacing={3}>
      <Stack alignItems={{ xs: 'stretch', sm: 'flex-start' }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Typography variant="h1">Phases</Typography>
          <Typography color="text.secondary">
            Liste des phases du tournoi avec toutes les informations actuellement exposees par l&apos;API.
          </Typography>
        </Stack>
        <Button onClick={openCreateDrawer} variant="contained">
          Ajouter une phase
        </Button>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : phases.length === 0 ? (
        <Alert severity="info">Aucune phase disponible.</Alert>
      ) : (
        <Stack spacing={0}>
          {phases.map((phase) => (
            <PhaseAccordion
              expanded={expandedPhaseId === phase.id}
              key={phase.id}
              onChange={handleAccordionChange(phase.id)}
              onEdit={openUpdateDrawer}
              phase={phase}
            />
          ))}
        </Stack>
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
          <ManagePhaseForm
            initialValue={emptyPhaseForm}
            onClose={closeDrawer}
            onSubmit={saveCreatedPhase}
            titleLabel="Nouvelle phase"
          />
        ) : null}
        {drawerMode === 'update' && selectedPhase ? (
          <ManagePhaseForm
            initialValue={toPhasePayload(selectedPhase)}
            onClose={closeDrawer}
            onSubmit={saveUpdatedPhase}
            titleLabel="Modifier la phase"
          />
        ) : null}
      </Drawer>
    </Stack>
  )
}
