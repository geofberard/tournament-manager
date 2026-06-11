import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { GameStatus } from '../../generated/api-client'
import type { Phase } from '../../services/phasesService'
import type { GamePayload } from '../../services/gamesService'
import type { Team } from '../../services/teamsService'

type ManageGameFormProps = {
  initialValue: GamePayload
  isUpdate: boolean
  onClose: () => void
  onSubmit: (gamePayload: GamePayload) => Promise<void>
  phases: Phase[]
  teams: Team[]
  titleLabel: string
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

export const ManageGameForm = ({
  initialValue,
  isUpdate,
  onClose,
  onSubmit,
  phases,
  teams,
  titleLabel,
}: ManageGameFormProps) => {
  const [formValue, setFormValue] = useState<GamePayload>(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleTextChange =
    (field: keyof Pick<GamePayload, 'court' | 'group' | 'name'>) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
    }

  const handleSelectChange =
    (field: keyof Pick<GamePayload, 'phaseId' | 'refereeId' | 'status'>) => (event: SelectChangeEvent) => {
      setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
    }

  const handleContestantsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const contestantIds = typeof value === 'string' ? value.split(',') : value

    if (contestantIds.length > 2) {
      return
    }

    setFormValue((currentValue) => ({
      ...currentValue,
      contestantIds: new Set(contestantIds),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (formValue.contestantIds.size !== 2) {
      setSubmitError('Selectionnez exactement deux equipes.')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formValue,
        court: formValue.court.trim(),
        group: formValue.group.trim(),
        name: formValue.name?.trim() || undefined,
        refereeId: formValue.refereeId || undefined,
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La sauvegarde du match a echoue.')
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography component="h2" fontWeight={800} variant="h5">
          {titleLabel}
        </Typography>
        <Typography color="text.secondary">Renseignez les informations d&apos;organisation du match.</Typography>
      </Stack>

      <Divider />

      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <FormControl fullWidth required>
          <InputLabel id="game-phase-label">Phase</InputLabel>
          <Select
            label="Phase"
            labelId="game-phase-label"
            onChange={handleSelectChange('phaseId')}
            value={formValue.phaseId}
          >
            {phases.map((phase) => (
              <MenuItem key={phase.id} value={phase.id}>
                {phase.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          fullWidth
          label="Groupe"
          onChange={handleTextChange('group')}
          required
          value={formValue.group}
        />

        <TextField
          fullWidth
          label="Date et heure"
          onChange={(event) =>
            setFormValue((currentValue) => ({ ...currentValue, time: new Date(event.target.value) }))
          }
          required
          slotProps={{ inputLabel: { shrink: true } }}
          type="datetime-local"
          value={toDateTimeLocalValue(formValue.time)}
        />

        <TextField
          fullWidth
          label="Terrain"
          onChange={handleTextChange('court')}
          required
          value={formValue.court}
        />

        <TextField fullWidth label="Nom" onChange={handleTextChange('name')} value={formValue.name ?? ''} />

        <FormControl fullWidth required>
          <InputLabel id="game-contestants-label">Equipes</InputLabel>
          <Select
            label="Equipes"
            labelId="game-contestants-label"
            multiple
            onChange={handleContestantsChange}
            renderValue={(selected) =>
              teams
                .filter((team) => selected.includes(team.id))
                .map((team) => team.name)
                .join(', ')
            }
            value={[...formValue.contestantIds]}
          >
            {teams.map((team) => {
              const isSelected = formValue.contestantIds.has(team.id)

              return (
                <MenuItem
                  disabled={formValue.contestantIds.size === 2 && !isSelected}
                  key={team.id}
                  value={team.id}
                >
                  <Checkbox checked={isSelected} />
                  <ListItemText primary={team.name} />
                </MenuItem>
              )
            })}
          </Select>
          <FormHelperText>Selectionnez exactement 2 equipes.</FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="game-referee-label">Arbitre</InputLabel>
          <Select
            label="Arbitre"
            labelId="game-referee-label"
            onChange={handleSelectChange('refereeId')}
            value={formValue.refereeId ?? ''}
          >
            <MenuItem value="">Aucun</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isUpdate ? (
          <FormControl fullWidth required>
            <InputLabel id="game-status-label">Statut</InputLabel>
            <Select
              label="Statut"
              labelId="game-status-label"
              onChange={handleSelectChange('status')}
              value={formValue.status}
            >
              {Object.values(GameStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {statusLabels[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}
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
