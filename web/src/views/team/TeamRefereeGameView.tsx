import { CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useGame } from '../../hooks/useGames'
import { GameCounter } from '../../components/shared/GameCounter'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatContestants = (game: any) =>
  Array.from(game?.contestants || [])
    .map((team: any) => team?.name)
    .join(' vs ')

export const TeamRefereeGameView = () => {
  const { id } = useParams<{ id: string }>()
  const { game, isLoading } = useGame(id)

  return (
    <Stack>
      {isLoading
        ? (<CircularProgress />)
        : (
          <Stack spacing={3}>
            <Typography variant="h2" sx={{ fontWeight: 700, textAlign: 'center' }}>
              {formatContestants(game ?? {})}
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, textAlign: 'center' }}>
                {game?.court ? `${game.court}` : 'Terrain inconnu'} - {game?.time ? new Date(game.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'center'}}>
                {game?.phase ? `Phase: ${game.phase.name}` : 'Phase inconnue'}
              </Typography>
            </Stack>

            <Divider />

            {game ? (<GameCounter game={game} />) : null}
          </Stack>
        )
      }
    </Stack>
  )
}