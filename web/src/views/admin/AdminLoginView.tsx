import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'

type AdminLoginViewProps = {
  isLoading?: boolean
  onLogin: (username: string, password: string) => Promise<void>
}

export const AdminLoginView = ({ isLoading = false, onLogin }: AdminLoginViewProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    try {
      await onLogin(username, password)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'La connexion a echoue.')
    }
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 480, mx: 'auto', py: { xs: 4, md: 10 }, px: 2 }}>
      <Typography variant="h1">Connexion admin</Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            <Typography color="text.secondary">
              Cette zone a son propre login, séparé de la sélection d'équipe.
            </Typography>
            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
            <TextField
              label="Nom d'utilisateur"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isLoading}
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
            <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
              Se connecter
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
