import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { Alert, Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'

type BulkCreateTeamsFormProps = {
  onClose: () => void
  onSubmit: (teamNames: string[]) => Promise<string[]>
}

const parseTeamNames = (value: string) => {
  const uniqueNames = new Map<string, string>()

  value.split(/\r?\n/).forEach((line) => {
    const name = line.trim()
    const normalizedName = name.toLocaleLowerCase('fr')
    if (name && !uniqueNames.has(normalizedName)) uniqueNames.set(normalizedName, name)
  })

  return Array.from(uniqueNames.values())
}

export const BulkCreateTeamsForm = ({ onClose, onSubmit }: BulkCreateTeamsFormProps) => {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const teamNames = parseTeamNames(value)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setSubmitError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (teamNames.length === 0) return

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const failedNames = await onSubmit(teamNames)
      if (failedNames.length > 0) {
        setValue(failedNames.join('\n'))
        setSubmitError(
          `${failedNames.length} équipe${failedNames.length > 1 ? 's n’ont' : " n’a"} pas pu être créée${failedNames.length > 1 ? 's' : ''}. Seules les lignes à réessayer sont conservées.`,
        )
        setIsSubmitting(false)
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'La création des équipes a échoué.')
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography component="h2" fontWeight={800} variant="h5">
          Créer plusieurs équipes
        </Typography>
        <Typography color="text.secondary">
          Saisissez une équipe par ligne. Les lignes vides et les doublons seront ignorés.
        </Typography>
      </Stack>

      <Divider />

      <Stack spacing={2.5} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}

        <TextField
          autoFocus
          fullWidth
          helperText={`${teamNames.length} équipe${teamNames.length > 1 ? 's' : ''} à créer`}
          label="Noms des équipes"
          minRows={10}
          multiline
          onChange={handleChange}
          placeholder={'Aigles\nFaucons\nTigres'}
          value={value}
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ p: 2 }}>
        <Button disabled={isSubmitting} onClick={onClose}>Annuler</Button>
        <Button disabled={isSubmitting || teamNames.length === 0} type="submit" variant="contained">
          {isSubmitting ? 'Création...' : `Créer ${teamNames.length ? `(${teamNames.length})` : ''}`.trim()}
        </Button>
      </Stack>
    </Box>
  )
}
