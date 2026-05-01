import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

type AdminLoginViewProps = {
  onLogin: () => void
}

export function AdminLoginView({ onLogin }: AdminLoginViewProps) {
  return (
    <Stack spacing={3} sx={{ maxWidth: 480, mx: 'auto', py: { xs: 4, md: 10 }, px: 2 }}>
      <Typography variant="h1">Connexion admin</Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2.5}>
            <Typography color="text.secondary">
              Cette zone a son propre login, séparé de la sélection d'équipe.
            </Typography>
            <Button variant="contained" color="primary" onClick={onLogin}>
              Se connecter comme admin
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
