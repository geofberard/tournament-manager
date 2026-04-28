import { Box, ButtonBase, Chip, List, ListItem, Stack, Typography } from '@mui/material'
import type { Team } from '../services/teamsService'

type TeamListProps = {
  teams: Team[]
  currentTeamId?: string | null
  onSelectTeam?: (team: Team) => void
}

export function TeamList({ teams, currentTeamId = null, onSelectTeam }: TeamListProps) {
  return (
    <List disablePadding>
      {teams.map((team) => {
        const isSelected = team.id === currentTeamId

        return (
        <ListItem
          key={team.id}
          disableGutters
          sx={{
            mb: 1.5,
          }}
        >
          <ButtonBase
            onClick={onSelectTeam ? () => onSelectTeam(team) : undefined}
            sx={{
              width: '100%',
              textAlign: 'left',
              borderRadius: 3,
              border: '1px solid',
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isSelected ? 'primary.50' : 'background.paper',
              transition: 'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 3,
              },
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: '100%', px: 2, py: 1.75 }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {team.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {team.id}
                </Typography>
              </Box>
              <Chip
                label={isSelected ? 'Selectionnee' : 'Choisir'}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
              />
            </Stack>
          </ButtonBase>
        </ListItem>
        )
      })}
    </List>
  )
}
