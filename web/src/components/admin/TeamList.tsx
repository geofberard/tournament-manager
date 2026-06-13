import EditIcon from '@mui/icons-material/Edit'
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
} from '@mui/material'
import type { Team } from '../../services/teamsService'
import { DeleteButton } from './DeleteButton'

type TeamListProps = {
  onDelete: (team: Team) => Promise<void> | void
  onEdit: (team: Team) => void
  teams: Team[]
}

export const TeamList = ({ onDelete, onEdit, teams }: TeamListProps) => (
  <Paper variant="outlined">
    <List disablePadding>
      {teams.map((team, index) => (
        <ListItem
          divider={index < teams.length - 1}
          key={team.id}
          secondaryAction={
            <Stack direction="row" spacing={1}>
              <IconButton aria-label={`Editer ${team.name}`} onClick={() => onEdit(team)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <DeleteButton onConfirm={() => onDelete(team)} />
            </Stack>
          }
          sx={{ minHeight: 56, pr: 11 }}
        >
          <ListItemText primary={team.name} primaryTypographyProps={{ fontWeight: 700 }} />
        </ListItem>
      ))}
    </List>
  </Paper>
)
