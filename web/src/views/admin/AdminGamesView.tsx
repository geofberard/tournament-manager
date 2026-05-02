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
import { useGames } from '../../hooks/useGames'
import type { Game } from '../../services/gamesService'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const formatTeams = (game: Game) =>
  Array.from(game.contestants)
    .map((team) => team.name)
    .join(' / ')

const formatScore = (game: Game) => {
  const score = game.score as { pointsByTeam?: Record<string, number> } | null

  if (!score?.pointsByTeam) {
    return '—'
  }

  return Array.from(game.contestants)
    .map((team) => `${team.name}: ${score.pointsByTeam?.[team.id] ?? 0}`)
    .join(' / ')
}

export const AdminGamesView = () => {
  const { games, isLoading, errorMessage } = useGames()

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h1">Matchs</Typography>
        <Typography color="text.secondary">
          Liste des matchs du tournoi avec toutes les informations actuellement exposees par l&apos;API.
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
                    <TableCell>Heure</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>Groupe</TableCell>
                    <TableCell>Terrain</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Equipes</TableCell>
                    <TableCell>Arbitre</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Identifiant</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {games.map((game) => (
                    <TableRow key={game.id} hover>
                      <TableCell>{dateFormatter.format(game.time)}</TableCell>
                      <TableCell>{game.name?.trim() || '—'}</TableCell>
                      <TableCell>{game.phase.name}</TableCell>
                      <TableCell>{game.group}</TableCell>
                      <TableCell>{game.court}</TableCell>
                      <TableCell>{game.status}</TableCell>
                      <TableCell>{formatTeams(game)}</TableCell>
                      <TableCell>{game.referee?.name || '—'}</TableCell>
                      <TableCell>{formatScore(game)}</TableCell>
                      <TableCell>{game.id}</TableCell>
                    </TableRow>
                  ))}
                  {games.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Aucun match disponible.
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
