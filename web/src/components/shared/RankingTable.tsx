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
  const sortedRankings = [...rankings].sort(
    (first, second) => second.score - first.score || second.pointsDiff - first.pointsDiff,
  )

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
            <TableCell align="center">J</TableCell>
            <TableCell align="center">G</TableCell>
            <TableCell align="center">N</TableCell>
            <TableCell align="center">D</TableCell>
            <TableCell align="center">Pts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRankings.map((entry, index) => {
            const isSelected = entry.contestant.id === currentTeamId
            const rankingIndex = index + 1
            const isTop3 = rankingIndex <= 3
            let colorChip

            switch (rankingIndex) {
              case 1:
                colorChip = '#ffc107a6'
                break
              case 2:
                colorChip = '#9e9e9ea6'
                break
              case 3:
                colorChip = '#b57c59a6'
                break
              default:
                colorChip = 'default'
                break
            }

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
                    {isTop3 ?
                      <Chip size="small" sx={{ backgroundColor: colorChip }} label={rankingIndex} />
                      : <Typography variant="body2">{rankingIndex}</Typography>
                    }
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
