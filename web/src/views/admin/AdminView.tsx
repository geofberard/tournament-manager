import { Card, CardContent, Stack, Typography } from '@mui/material'

type AdminViewProps = {
  username: string | null
}

export const AdminView = ({ username }: AdminViewProps) => {
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
            {username ? <Typography color="text.secondary">Connecté en tant que {username}</Typography> : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
