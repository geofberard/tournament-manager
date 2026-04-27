import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'

export function PageHeader() {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        background:
          'linear-gradient(135deg, rgba(21,101,192,0.10), rgba(0,137,123,0.08))',
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={2}>
          <Chip
            label="Tournament Manager"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
          <Typography variant="h1" component="h1">
            Equipes du tournoi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            La liste ci-dessous est chargee via le client TypeScript genere a
            partir du contrat OpenAPI.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
