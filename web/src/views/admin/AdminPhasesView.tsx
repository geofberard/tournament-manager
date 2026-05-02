import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { usePhases } from '../../hooks/usePhases'

export const AdminPhasesView = () => {
  const { phases, isLoading, errorMessage } = usePhases()

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h1">Phases</Typography>
        <Typography color="text.secondary">
          Liste des phases du tournoi avec toutes les informations actuellement exposees par l&apos;API.
        </Typography>
      </Stack>

      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 240 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Card variant="outlined">
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ordre</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Identifiant</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {phases.map((phase) => (
                    <TableRow key={phase.id} hover>
                      <TableCell>{phase.order}</TableCell>
                      <TableCell>{phase.name}</TableCell>
                      <TableCell>{phase.type}</TableCell>
                      <TableCell>{phase.id}</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-line' }}>{phase.details?.trim() || '—'}</TableCell>
                    </TableRow>
                  ))}
                  {phases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucune phase disponible.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
