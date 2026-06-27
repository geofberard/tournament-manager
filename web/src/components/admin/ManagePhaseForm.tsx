import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { Phase, PhasePayload } from '../../services/phasesService'
import type { PhaseType } from '../../services/apiClient'
import { PhaseSelect } from './PhaseSelect'

type ManagePhaseFormProps = {
  currentPhaseId?: string
  initialValue: PhasePayload
  onClose: () => void
  onSubmit: (phasePayload: PhasePayload) => Promise<void>
  titleLabel: string
}

export const ManagePhaseForm = ({
  currentPhaseId,
  initialValue,
  onClose,
  onSubmit,
  titleLabel,
}: ManagePhaseFormProps) => {
  const [formValue, setFormValue] = useState<PhasePayload>(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleTextChange = (field: keyof Pick<PhasePayload, 'details' | 'name'>) => (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setFormValue((currentValue) => ({
      ...currentValue,
      [field]: event.target.value,
    }))
  }

  const handleOrderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue((currentValue) => ({
      ...currentValue,
      order: Number(event.target.value),
    }))
  }

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setFormValue((currentValue) => ({
      ...currentValue,
      type: event.target.value ? event.target.value as PhaseType : undefined,
    }))
  }

  const handleParentChange = (phase?: Phase) => {
    setFormValue((currentValue) => ({
      ...currentValue,
      parentId: phase?.id,
    }))
  }

  const isParentPhaseDisabled = (phase: Phase) =>
    Boolean(currentPhaseId && (phase.id === currentPhaseId || phase.parentId === currentPhaseId))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formValue,
        details: formValue.details?.trim() || undefined,
        name: formValue.name.trim(),
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La sauvegarde de la phase a echoue.')
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography component="h2" variant="h5" fontWeight={800}>
          {titleLabel}
        </Typography>
        <Typography color="text.secondary">
          Renseignez les informations affichees dans l&apos;administration du tournoi.
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <TextField
          autoFocus
          fullWidth
          label="Nom"
          name="name"
          onChange={handleTextChange('name')}
          required
          value={formValue.name}
        />

        <TextField
          fullWidth
          inputProps={{ min: 1 }}
          label="Ordre"
          name="order"
          onChange={handleOrderChange}
          required
          type="number"
          value={formValue.order}
        />

        <PhaseSelect
          allowEmpty
          isPhaseDisabled={isParentPhaseDisabled}
          label="Phase parente"
          onChange={handleParentChange}
          value={formValue.parentId ?? ''}
        />

        <FormControl fullWidth>
          <InputLabel id="phase-type-label">Type</InputLabel>
          <Select
            label="Type"
            labelId="phase-type-label"
            onChange={handleTypeChange}
            value={formValue.type ?? ''}
          >
            <MenuItem value="">Aucun type</MenuItem>
            <MenuItem value="POOL">Poules</MenuItem>
            <MenuItem value="BRACKET">Elimination</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Details"
          minRows={5}
          multiline
          name="details"
          onChange={handleTextChange('details')}
          value={formValue.details ?? ''}
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button disabled={isSubmitting} type="submit" variant="contained">
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </Stack>
    </Box>
  )
}
