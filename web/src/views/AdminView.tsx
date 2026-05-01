import { Button, Card, CardContent, Stack, Typography } from '@mui/material'

type AdminViewProps = {
  onLogout: () => void
}

export function AdminView({ onLogout }: AdminViewProps) {
  return (
    <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
      <Typography variant="h1">Zone admin</Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h2">Hello world</Typography>
            <Typography color="text.secondary">
              Cette page est protégée par un login admin dédié.
            </Typography>
            <Button variant="outlined" color="secondary" onClick={onLogout} sx={{ alignSelf: 'flex-start' }}>
              Se déconnecter
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
