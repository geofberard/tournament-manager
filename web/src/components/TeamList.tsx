import { Chip, List, ListItem, ListItemText } from '@mui/material'
import type { Team } from '../services/teamsService'

type TeamListProps = {
  teams: Team[]
}

export function TeamList({ teams }: TeamListProps) {
  return (
    <List disablePadding>
      {teams.map((team, index) => (
        <ListItem
          key={team.id}
          disableGutters
          secondaryAction={<Chip label={team.id} variant="outlined" />}
          sx={{
            px: 2,
            py: 1.5,
            mb: 1.5,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <ListItemText
            primary={team.name}
            secondary={`Equipe ${index + 1}`}
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItem>
      ))}
    </List>
  )
}
