import { Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { Navigate, useParams } from 'react-router-dom'
import { useGame } from '../../hooks/useGame'
import { GameCounter } from '../../components/shared/GameCounter'
import type { Game } from '../../services/gamesService'
import type { Team } from '../../services/teamsService'
import type { Theme } from "@mui/material/styles";
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';

const formatContestants = (game: Game) =>
  Array.from(game?.contestants || [])
    .map((team: Team) => team?.name)
    .join(' VS ')

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
})

export const TeamRefereeGameView = () => {
  const { id } = useParams<{ id?: string }>()
  const { game, isLoading } = useGame(id) ?? { game: null, isLoading: false }

  // If no ID is provided, redirect to the list of games
  if (!id || !isLoading && !game) {
    return <Navigate to="/team/games" replace />
  }

  const sxHeader = {
    backgroundColor: (theme: Theme) => `${theme.palette.primary.dark}`,
    color: (theme: Theme) => `${theme.palette.primary.contrastText}`,
    p: 2,
    borderRadius: 1
  }

  const sxChip = {
    backgroundColor: (theme: Theme) => `${theme.palette.primary.contrastText}`,
    color: (theme: Theme) => `${theme.palette.primary.main}`,
  }

  return (
    <Stack>
      {isLoading
        ? (<CircularProgress />)
        : (
          <Stack spacing={3}>
            <Stack spacing={3} sx={sxHeader}>
              <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {formatContestants(game!)}
              </Typography>
              <Stack direction="row" flexWrap="wrap" alignItems="center" justifyContent="center" gap={1}>
                <Chip
                  avatar={<RoomOutlinedIcon />}
                  label={game?.court ? game?.court : 'Terrain inconnu'}
                  sx={sxChip} />
                <Chip
                  avatar={<AccessTimeOutlinedIcon />}
                  label={game?.time ? timeFormatter.format(new Date(game.time)) : '--:--'}
                  sx={sxChip} />
                <Chip
                  avatar={<AccountTreeOutlinedIcon />}
                  label={game?.phase ? game?.phase.name : 'Phase inconnue'}
                  sx={sxChip} />
              </Stack>
            </Stack>

            <Divider />

            {game ? (<GameCounter game={game} />) : null}
          </Stack>
        )
      }
    </Stack>
  )
}
