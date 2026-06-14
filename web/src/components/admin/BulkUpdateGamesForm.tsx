import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import type { SelectChangeEvent } from '@mui/material/Select'
import { GameStatus } from '../../generated/api-client'
import type { BulkGameChanges } from '../../services/gamesService'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type BulkField =
  | 'court'
  | 'group'
  | 'name'
  | 'phaseId'
  | 'refereeId'
  | 'status'
  | 'time'
  | 'timeOffsetMinutes'

type BulkUpdateGamesFormProps = {
  gameCount: number
  onClose: () => void
  onSubmit: (changes: BulkGameChanges) => Promise<void>
  phases: Phase[]
  teams: Team[]
}

const statusLabels = {
  [GameStatus.Scheduled]: 'Planifie',
  [GameStatus.InProgress]: 'En cours',
  [GameStatus.Completed]: 'Termine',
  [GameStatus.Canceled]: 'Annule',
}

const toDateTimeLocalValue = (date: Date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export const BulkUpdateGamesForm = ({
  gameCount,
  onClose,
  onSubmit,
  phases,
  teams,
}: BulkUpdateGamesFormProps) => {
  const [enabledFields, setEnabledFields] = useState<Set<BulkField>>(new Set())
  const [values, setValues] = useState({
    court: '',
    group: '',
    name: '',
    phaseId: '',
    refereeId: '',
    status: GameStatus.Scheduled,
    time: new Date(),
    timeOffsetMinutes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const timeOffsetMinutes = Number(values.timeOffsetMinutes)
  const isTimeOffsetInvalid =
    enabledFields.has('timeOffsetMinutes') &&
    (values.timeOffsetMinutes === '' ||
      !Number.isInteger(timeOffsetMinutes) ||
      timeOffsetMinutes === 0)

  const toggleField = (field: BulkField) => (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setEnabledFields((currentFields) => {
      const updatedFields = new Set(currentFields)
      if (checked) {
        updatedFields.add(field)
        if (field === 'time') updatedFields.delete('timeOffsetMinutes')
        if (field === 'timeOffsetMinutes') updatedFields.delete('time')
      } else {
        updatedFields.delete(field)
      }
      return updatedFields
    })
  }

  const handleTextChange =
    (field: 'court' | 'group' | 'name') => (event: ChangeEvent<HTMLInputElement>) => {
      setValues((currentValues) => ({ ...currentValues, [field]: event.target.value }))
    }

  const handleSelectChange =
    (field: 'phaseId' | 'refereeId' | 'status') => (event: SelectChangeEvent) => {
      setValues((currentValues) => ({ ...currentValues, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const changes: BulkGameChanges = {}

    if (enabledFields.has('phaseId')) changes.phaseId = values.phaseId
    if (enabledFields.has('group')) changes.group = values.group.trim()
    if (enabledFields.has('time')) changes.time = values.time
    if (enabledFields.has('timeOffsetMinutes')) {
      changes.timeOffsetMinutes = timeOffsetMinutes
    }
    if (enabledFields.has('court')) changes.court = values.court.trim()
    if (enabledFields.has('status')) changes.status = values.status
    if (enabledFields.has('name')) {
      if (values.name.trim()) changes.name = values.name.trim()
      else changes.clearName = true
    }
    if (enabledFields.has('refereeId')) {
      if (values.refereeId) changes.refereeId = values.refereeId
      else changes.clearReferee = true
    }
    setIsSubmitting(true)
    try {
      await onSubmit(changes)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'La modification des matchs a echoue.',
      )
      setIsSubmitting(false)
    }
  }

  const fieldControl = (
    field: BulkField,
    label: string,
    control: ReactNode,
    actionLabel = `Modifier ${label.toLowerCase()}`,
  ) => (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={enabledFields.has(field)} onChange={toggleField(field)} />}
        label={actionLabel}
      />
      <Box sx={{ pl: 4 }}>{control}</Box>
    </Box>
  )

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography component="h2" fontWeight={800} variant="h5">
          Modifier {gameCount} matchs
        </Typography>
        <Typography color="text.secondary">
          Cochez uniquement les valeurs a remplacer sur tous les matchs selectionnes.
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        {fieldControl(
          'phaseId',
          'la phase',
          <FormControl disabled={!enabledFields.has('phaseId')} fullWidth required={enabledFields.has('phaseId')}>
            <InputLabel id="bulk-game-phase-label">Phase</InputLabel>
            <Select
              label="Phase"
              labelId="bulk-game-phase-label"
              onChange={handleSelectChange('phaseId')}
              value={values.phaseId}
            >
              {phases.map((phase) => (
                <MenuItem key={phase.id} value={phase.id}>
                  {phase.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>,
        )}

        {fieldControl(
          'group',
          'le groupe',
          <TextField
            disabled={!enabledFields.has('group')}
            fullWidth
            label="Groupe"
            onChange={handleTextChange('group')}
            required={enabledFields.has('group')}
            value={values.group}
          />,
        )}

        {fieldControl(
          'time',
          'la date et heure',
          <TextField
            disabled={!enabledFields.has('time')}
            fullWidth
            label="Date et heure"
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                time: new Date(event.target.value),
              }))
            }
            required={enabledFields.has('time')}
            slotProps={{ inputLabel: { shrink: true } }}
            type="datetime-local"
            value={toDateTimeLocalValue(values.time)}
          />,
        )}

        {fieldControl(
          'timeOffsetMinutes',
          "le decalage de l'heure",
          <TextField
            disabled={!enabledFields.has('timeOffsetMinutes')}
            error={isTimeOffsetInvalid}
            fullWidth
            helperText={
              isTimeOffsetInvalid
                ? 'Saisissez un nombre entier different de zero.'
                : 'Utilisez une valeur positive pour retarder les matchs, negative pour les avancer.'
            }
            label="Decalage en minutes"
            onChange={(event) =>
              setValues((currentValues) => ({
                ...currentValues,
                timeOffsetMinutes: event.target.value,
              }))
            }
            required={enabledFields.has('timeOffsetMinutes')}
            slotProps={{ htmlInput: { step: 1 } }}
            type="number"
            value={values.timeOffsetMinutes}
          />,
          "Décaler l'heure",
        )}

        {fieldControl(
          'court',
          'le terrain',
          <TextField
            disabled={!enabledFields.has('court')}
            fullWidth
            label="Terrain"
            onChange={handleTextChange('court')}
            required={enabledFields.has('court')}
            value={values.court}
          />,
        )}

        {fieldControl(
          'name',
          'le nom',
          <TextField
            disabled={!enabledFields.has('name')}
            fullWidth
            helperText="Laissez vide pour effacer le nom."
            label="Nom"
            onChange={handleTextChange('name')}
            value={values.name}
          />,
        )}

        {fieldControl(
          'refereeId',
          "l'arbitre",
          <FormControl disabled={!enabledFields.has('refereeId')} fullWidth>
            <InputLabel id="bulk-game-referee-label">Arbitre</InputLabel>
            <Select
              label="Arbitre"
              labelId="bulk-game-referee-label"
              onChange={handleSelectChange('refereeId')}
              value={values.refereeId}
            >
              <MenuItem value="">Aucun</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>,
        )}

        {fieldControl(
          'status',
          'le statut',
          <FormControl disabled={!enabledFields.has('status')} fullWidth required={enabledFields.has('status')}>
            <InputLabel id="bulk-game-status-label">Statut</InputLabel>
            <Select
              label="Statut"
              labelId="bulk-game-status-label"
              onChange={handleSelectChange('status')}
              value={values.status}
            >
              {Object.values(GameStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {statusLabels[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>,
        )}
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          disabled={enabledFields.size === 0 || isTimeOffsetInvalid || isSubmitting}
          type="submit"
          variant="contained"
        >
          {isSubmitting ? 'Modification...' : 'Modifier les matchs'}
        </Button>
      </Stack>
    </Box>
  )
}
