import { Alert, Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import type { ContestantStats } from '../../services/statisticsService'

type RankingTableProps = {
  currentTeamId: string
  errorMessage: string | null
  isLoading: boolean
  rankings: ContestantStats[]
}

export const RankingTable = ({
  currentTeamId,
  errorMessage,
  isLoading,
  rankings,
}: RankingTableProps) => {
  if (errorMessage) {
    return <Alert severity="error">{errorMessage}</Alert>
  }

  if (!isLoading && rankings.length === 0) {
    return <Alert severity="info">Les resultats ne sont pas encore disponibles.</Alert>
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 72 }}>
              #
            </TableCell>
            <TableCell>Equipe</TableCell>
            <TableCell align="center">P</TableCell>
            <TableCell align="center">G</TableCell>
            <TableCell align="center">N</TableCell>
            <TableCell align="center">D</TableCell>
            <TableCell align="center">Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankings.map((entry, index) => {
            const isSelected = entry.contestant.id === currentTeamId

            return (
              <TableRow
                key={entry.contestant.id}
                selected={isSelected}
                sx={{
                  '& td': {
                    fontWeight: isSelected ? 700 : 400,
                  },
                }}
              >
                <TableCell align="center" sx={{ width: 72 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {isSelected ? (
                      <Chip size="small" color="primary" label={index + 1} />
                    ) : (
                      <Typography variant="body2">{index + 1}</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{entry.contestant.name}</TableCell>
                <TableCell align="center">{entry.played}</TableCell>
                <TableCell align="center">{entry.won}</TableCell>
                <TableCell align="center">{entry.drawn}</TableCell>
                <TableCell align="center">{entry.lost}</TableCell>
                <TableCell align="center">{entry.score}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
