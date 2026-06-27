import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../../services/dateTimeLocal'
import type { GamePayload } from '../../services/gamesService'
import type { Team } from '../../services/teamsService'
import type { PhaseNode } from '../../hooks/usePhaseTree'
import { findPhaseName, renderPhaseMenuItems } from './phaseSelectOptions'

type ManageGameFormProps = {
  initialValue: GamePayload
  isUpdate: boolean
  onClose: () => void
  onSubmit: (gamePayload: GamePayload) => Promise<void>
  phaseTree: PhaseNode[]
  teams: Team[]
  titleLabel: string
}

export const ManageGameForm = ({
  initialValue,
  onClose,
  onSubmit,
  phaseTree,
  teams,
  titleLabel,
}: ManageGameFormProps) => {
  const [formValue, setFormValue] = useState<GamePayload>(initialValue)
  const [contestantIds, setContestantIds] = useState<string[]>(() => {
    const initialContestantIds = [...initialValue.contestantIds]
    return [initialContestantIds[0] ?? '', initialContestantIds[1] ?? '']
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleTextChange =
    (field: keyof Pick<GamePayload, 'court'>) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
    }

  const handleSelectChange =
    (field: keyof Pick<GamePayload, 'phaseId' | 'refereeId'>) => (event: SelectChangeEvent) => {
      setFormValue((currentValue) => ({ ...currentValue, [field]: event.target.value }))
    }

  const handleContestantChange = (index: number) => (event: SelectChangeEvent) => {
    const previousTeamId = contestantIds[index]
    const updatedContestantIds = [...contestantIds]
    updatedContestantIds[index] = event.target.value
    setContestantIds(updatedContestantIds)

    setFormValue((currentValue) => {
      const pointsByTeam = previousTeamId
        ? Object.fromEntries(
            Object.entries(currentValue.pointsByTeam ?? {}).filter(([teamId]) => teamId !== previousTeamId),
          )
        : currentValue.pointsByTeam

      return {
        ...currentValue,
        contestantIds: new Set(updatedContestantIds.filter(Boolean)),
        pointsByTeam: pointsByTeam && Object.keys(pointsByTeam).length > 0 ? pointsByTeam : null,
      }
    })
  }

  const handleScoreChange = (teamId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setFormValue((currentValue) => {
      const pointsByTeam = { ...(currentValue.pointsByTeam ?? {}) }

      if (value === '') {
        delete pointsByTeam[teamId]
      } else {
        pointsByTeam[teamId] = Number(value)
      }

      return {
        ...currentValue,
        pointsByTeam: Object.keys(pointsByTeam).length > 0 ? pointsByTeam : null,
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    if (contestantIds.some((teamId) => !teamId) || new Set(contestantIds).size !== 2) {
      setSubmitError('Selectionnez exactement deux equipes.')
      return
    }

    const scoreCount = contestantIds.filter(
      (teamId) => formValue.pointsByTeam?.[teamId] !== undefined,
    ).length

    if (scoreCount === 1) {
      setSubmitError('Renseignez le score des deux equipes ou laissez les deux scores vides.')
      return
    }

    if (
      formValue.pointsByTeam &&
      Object.values(formValue.pointsByTeam).some(
        (score) => !Number.isSafeInteger(score) || score < 0,
      )
    ) {
      setSubmitError('Les scores doivent etre des nombres entiers positifs ou nuls.')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formValue,
        court: formValue.court.trim(),
        pointsByTeam:
          scoreCount === 2
            ? Object.fromEntries(
                contestantIds.map((teamId) => [teamId, formValue.pointsByTeam![teamId]]),
              )
            : null,
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
            renderValue={(phaseId) => findPhaseName(phaseTree, phaseId) ?? phaseId}
            value={formValue.phaseId}
          >
            {renderPhaseMenuItems(phaseTree)}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Date et heure"
          onChange={(event) =>
            setFormValue((currentValue) => ({ ...currentValue, time: fromDateTimeLocalValue(event.target.value) }))
          }
          helperText="Laissez vide si l'horaire n'est pas encore defini."
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

        <Stack spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography fontWeight={700}>Equipes et score</Typography>
            <Typography color="text.secondary" variant="body2">
              Le score est facultatif, mais doit etre renseigne pour les deux equipes.
            </Typography>
          </Stack>

          {[0, 1].map((index) => {
            const teamId = contestantIds[index] ?? ''
            const otherTeamId = contestantIds[index === 0 ? 1 : 0]
            const score = teamId ? formValue.pointsByTeam?.[teamId] : undefined

            return (
              <Box
                key={index}
                sx={{
                  alignItems: 'start',
                  display: 'grid',
                  gap: 1.5,
                  gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 130px' },
                }}
              >
                <FormControl fullWidth required>
                  <InputLabel id={`game-contestant-${index}-label`}>Equipe {index + 1}</InputLabel>
                  <Select
                    label={`Equipe ${index + 1}`}
                    labelId={`game-contestant-${index}-label`}
                    onChange={handleContestantChange(index)}
                    value={teamId}
                  >
                    {teams.map((team) => (
                      <MenuItem disabled={team.id === otherTeamId} key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  disabled={!teamId}
                  fullWidth
                  label={`Score Equipe ${index + 1}`}
                  onChange={teamId ? handleScoreChange(teamId) : undefined}
                  slotProps={{ htmlInput: { min: 0 } }}
                  type="number"
                  value={score ?? ''}
                />
              </Box>
            )
          })}
          <FormHelperText>Selectionnez exactement 2 equipes differentes.</FormHelperText>
        </Stack>

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
