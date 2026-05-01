import { Alert, Card, CardContent, Stack, Typography } from '@mui/material'

export function PublicView() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto', py: { xs: 4, md: 8 }, px: 2 }}>
      <Typography variant="h1">Zone publique</Typography>
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h2">Hello world</Typography>
            <Typography color="text.secondary">
              Cette page est accessible à tous. Tu pourras y mettre ton contenu public plus tard.
            </Typography>
            <Alert severity="info">
              Les zones <strong>/team/*</strong> et <strong>/admin/*</strong> ont chacune leur propre
              logique d'accès.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
