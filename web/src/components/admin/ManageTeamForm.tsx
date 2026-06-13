import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import type { TeamPayload } from '../../services/teamsService'

type ManageTeamFormProps = {
  initialValue: TeamPayload
  onClose: () => void
  onSubmit: (teamPayload: TeamPayload) => Promise<void>
  titleLabel: string
}

export const ManageTeamForm = ({ initialValue, onClose, onSubmit, titleLabel }: ManageTeamFormProps) => {
  const [formValue, setFormValue] = useState<TeamPayload>(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue({ name: event.target.value })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ name: formValue.name.trim() })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "La sauvegarde de l'equipe a echoue.")
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
          Renseignez le nom affiche dans le tournoi.
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
          onChange={handleNameChange}
          required
          value={formValue.name}
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2 }}>
        <Button disabled={isSubmitting} onClick={onClose}>Annuler</Button>
        <Button disabled={isSubmitting} type="submit" variant="contained">
          {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </Stack>
    </Box>
  )
}
