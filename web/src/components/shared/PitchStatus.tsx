import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Box,
  keyframes
} from '@mui/material'
import PlaceIcon from '@mui/icons-material/Place'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import type {Game} from '../../services/gamesService'
import {GameStatus} from "../../generated/api-client";
import {getDisplayedGameStatus} from '../../services/gameStatus'

type PitchStatusProps = {
  games: Game[]
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

const pulseAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
`

export const PitchStatus = ({games}: PitchStatusProps) => {
  const gamesByCourt = games
    .filter(game => game.status !== GameStatus.Completed)
    .reduce((acc, game) => {
      if (!acc[game.court]) {
        acc[game.court] = []
      }
      acc[game.court].push(game)
      return acc
    }, {} as Record<string, Game[]>)

  const courts = Object.keys(gamesByCourt).sort()

  return (
    <Stack spacing={3}>
      {courts.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{fontStyle: 'italic'}}>
          Aucun match planifié sur les terrains.
        </Typography>
      ) : null}

      {courts.map((court) => {
        const courtGames = gamesByCourt[court]
        const inProgressGame = courtGames.find(
          (game) => getDisplayedGameStatus(game, games) === 'in_progress',
        )
        const upcomingGames = courtGames
          .filter((game) => getDisplayedGameStatus(game, games) === 'scheduled')
          .sort((a, b) => {
            const hasValidTimeA = a.time && a.time instanceof Date && !isNaN(a.time.getTime()) && a.time.getTime() > 0
            const hasValidTimeB = b.time && b.time instanceof Date && !isNaN(b.time.getTime()) && b.time.getTime() > 0

            if (hasValidTimeA && hasValidTimeB) {
              return a.time!.getTime() - b.time!.getTime()
            }
            if (hasValidTimeA) return -1
            if (hasValidTimeB) return 1
            return 0
          })

        return (
          <Card key={court} variant="elevation" elevation={2} sx={{borderRadius: 2, overflow: 'hidden'}}>
            <CardHeader
              avatar={
                <Avatar sx={{bgcolor: 'primary.main'}}>
                  <PlaceIcon/>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold">
                  {court}
                </Typography>
              }
              sx={{bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider', py: 1.5}}
            />
            <CardContent sx={{p: 0, '&:last-child': {pb: 0}}}>
              <List disablePadding>
                {/* Match en cours */}
                <ListItem sx={{py: 2}}>
                  <ListItemIcon sx={{minWidth: 40}}>
                    <PlayCircleOutlineIcon color={inProgressGame ? 'success' : 'disabled'}/>
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{secondary: {component: 'div'}}}
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2" color="text.secondary">
                          En cours
                        </Typography>
                        {inProgressGame && (
                          <Chip
                            size="small"
                            label="Live"
                            color="success"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              animation: `${pulseAnimation} 2s ease-in-out infinite`
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      inProgressGame ? (
                        <Typography variant="body1" fontWeight="bold" color="text.primary" sx={{mt: 0.5}}>
                          {Array.from(inProgressGame.contestants).map(c => c.name).join(' vs ')}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                          Aucun match en cours
                        </Typography>
                      )
                    }
                  />
                </ListItem>

                <Divider component="li"/>

                {/* Prochains matchs */}
                <ListItem sx={{py: 2, bgcolor: 'grey.50', alignItems: 'flex-start'}}>
                  <ListItemIcon sx={{minWidth: 40, mt: 0.5}}>
                    <ScheduleIcon color="action"/>
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{secondary: {component: 'div'}}}
                    primary={
                      <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                        À venir
                      </Typography>
                    }
                    secondary={
                      upcomingGames.length > 0 ? (
                        <Stack spacing={1.5}>
                          {upcomingGames.map((game) => (
                            <Box key={game.id} component="div" sx={{display: 'flex', alignItems: 'center'}}>
                              {game.time instanceof Date && !isNaN(game.time.getTime()) && game.time.getTime() > 0 &&
                                  <Chip
                                      size="small"
                                      label={formatTime(game.time)}
                                      variant="outlined"
                                      sx={{mr: 1.5, height: 24, minWidth: 56}}
                                  />}
                              <Typography component="span" variant="body2" color="text.primary" fontWeight="medium">
                                {Array.from(game.contestants).map(c => c.name).join(' vs ')}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                          Aucun match à venir
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  )
}
