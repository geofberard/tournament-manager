import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { PoolGamesPayload } from '../../services/gamesService'
import type { Phase } from '../../services/phasesService'
import type { Team } from '../../services/teamsService'

type CreatePoolGamesFormProps = {
  initialValue: PoolGamesPayload
  onClose: () => void
  onSubmit: (payload: PoolGamesPayload) => Promise<void>
  phases: Phase[]
  teams: Team[]
}

const toDateTimeLocalValue = (date: Date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

export const CreatePoolGamesForm = ({
  initialValue,
  onClose,
  onSubmit,
  phases,
  teams,
}: CreatePoolGamesFormProps) => {
  const poolPhases = phases.filter((phase) => phase.type === 'POOL')
  const [formValue, setFormValue] = useState<PoolGamesPayload>(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleTextChange =
    (field: 'court' | 'group') => (event: ChangeEvent<HTMLInputElement>) => {
      setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
    }

  const handleNumberChange =
    (field: 'breakDurationMinutes' | 'gameDurationMinutes') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormValue((currentValue) => ({
        ...currentValue,
        [field]: Number(event.target.value),
      }))
    }

  const handlePhaseChange = (event: SelectChangeEvent) => {
    setFormValue((currentValue) => ({ ...currentValue, phaseId: event.target.value }))
  }

  const toggleTeam = (teamId: string) => (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormValue((currentValue) => {
      const teamIds = new Set(currentValue.teamIds)
      if (checked) {
        teamIds.add(teamId)
      } else {
        teamIds.delete(teamId)
      }

      return {
        ...currentValue,
        assignReferees: teamIds.size < 3 ? false : currentValue.assignReferees,
        teamIds,
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (formValue.teamIds.size < 2) {
      setSubmitError('Selectionnez au moins deux equipes.')
      return
    }
    if (formValue.assignReferees && formValue.teamIds.size < 3) {
      setSubmitError('Selectionnez au moins trois equipes pour attribuer les arbitres.')
      return
    }
    if (!Number.isSafeInteger(formValue.gameDurationMinutes) || formValue.gameDurationMinutes < 1) {
      setSubmitError('La duree des matchs doit etre un nombre entier positif.')
      return
    }
    if (!Number.isSafeInteger(formValue.breakDurationMinutes) || formValue.breakDurationMinutes < 0) {
      setSubmitError('Le temps entre les matchs doit etre un nombre entier positif ou nul.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formValue,
        court: formValue.court.trim(),
        group: formValue.group.trim(),
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La creation des matchs a echoue.')
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography component="h2" fontWeight={800} variant="h5">
          Matchs d&apos;une poule
        </Typography>
        <Typography color="text.secondary">
          Generez toutes les rencontres de la poule sur un terrain.
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <FormControl fullWidth required>
          <InputLabel id="pool-games-phase-label">Phase</InputLabel>
          <Select
            label="Phase"
            labelId="pool-games-phase-label"
            onChange={handlePhaseChange}
            value={formValue.phaseId}
          >
            {poolPhases.map((phase) => (
              <MenuItem key={phase.id} value={phase.id}>
                {phase.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          fullWidth
          label="Poule"
          onChange={handleTextChange('group')}
          required
          value={formValue.group}
        />

        <TextField
          fullWidth
          label="Heure de debut"
          onChange={(event) =>
            setFormValue((currentValue) => ({
              ...currentValue,
              startTime: new Date(event.target.value),
            }))
          }
          required
          slotProps={{ inputLabel: { shrink: true } }}
          type="datetime-local"
          value={toDateTimeLocalValue(formValue.startTime)}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            label="Duree d'un match (min)"
            onChange={handleNumberChange('gameDurationMinutes')}
            required
            slotProps={{ htmlInput: { min: 1 } }}
            type="number"
            value={formValue.gameDurationMinutes}
          />
          <TextField
            fullWidth
            label="Temps entre les matchs (min)"
            onChange={handleNumberChange('breakDurationMinutes')}
            required
            slotProps={{ htmlInput: { min: 0 } }}
            type="number"
            value={formValue.breakDurationMinutes}
          />
        </Stack>

        <TextField
          fullWidth
          label="Terrain"
          onChange={handleTextChange('court')}
          required
          value={formValue.court}
        />

        <FormControl component="fieldset" required>
          <Typography component="legend" fontWeight={700}>
            Equipes
          </Typography>
          <FormGroup>
            {teams.map((team) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValue.teamIds.has(team.id)}
                    onChange={toggleTeam(team.id)}
                  />
                }
                key={team.id}
                label={team.name}
              />
            ))}
          </FormGroup>
          <FormHelperText>Selectionnez au moins deux equipes.</FormHelperText>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={formValue.assignReferees}
              disabled={formValue.teamIds.size < 3}
              onChange={(_event, checked) =>
                setFormValue((currentValue) => ({ ...currentValue, assignReferees: checked }))
              }
            />
          }
          label="Attribuer un arbitre parmi les equipes restantes"
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          disabled={isSubmitting || formValue.teamIds.size < 2 || poolPhases.length === 0}
          type="submit"
          variant="contained"
        >
          {isSubmitting ? 'Creation...' : 'Creer les matchs'}
        </Button>
      </Stack>
    </Box>
  )
}
