import EditIcon from '@mui/icons-material/Edit'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import type { Team } from '../../services/teamsService'
import { DeleteButton } from './DeleteButton'

type TeamListProps = {
  onDelete: (team: Team) => Promise<void> | void
  onEdit: (team: Team) => void
  teams: Team[]
}

type SortDirection = 'ascending' | 'descending'

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')

const teamNameCollator = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' })

export const TeamList = ({ onDelete, onEdit, teams }: TeamListProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending')

  const displayedTeams = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(searchQuery.trim())
    const matchingTeams = normalizedQuery
      ? teams.filter((team) => normalizeSearchValue(team.name).includes(normalizedQuery))
      : teams

    return [...matchingTeams].sort((teamA, teamB) => {
      const comparison = teamNameCollator.compare(teamA.name, teamB.name)
      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [searchQuery, sortDirection, teams])

  const resultLabel = searchQuery.trim()
    ? `${displayedTeams.length} résultat${displayedTeams.length > 1 ? 's' : ''} sur ${teams.length}`
    : `${teams.length} équipe${teams.length > 1 ? 's' : ''}`

  return (
    <Paper
      variant="outlined"
      sx={{ borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}
    >
      <Stack
        spacing={2.5}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', p: { xs: 2, sm: 2.5 } }}
      >
        <Stack direction="row" spacing={1.5}>
          <TextField
            fullWidth
            hiddenLabel
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher une équipe…"
            size="small"
            slotProps={{ htmlInput: { 'aria-label': 'Rechercher une équipe' } }}
            value={searchQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Effacer la recherche"
                    edge="end"
                    onClick={() => setSearchQuery('')}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{
              maxWidth: 520,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'action.hover',
                borderRadius: 999,
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'divider' },
              },
            }}
          />

          <Tooltip title="Inverser l’ordre alphabétique">
            <Button
              aria-label={sortDirection === 'ascending' ? 'Tri actuel A à Z. Inverser en Z à A' : 'Tri actuel Z à A. Inverser en A à Z'}
              color="inherit"
              endIcon={sortDirection === 'ascending' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
              onClick={() => setSortDirection((current) => current === 'ascending' ? 'descending' : 'ascending')}
              startIcon={<SortByAlphaIcon />}
              variant="outlined"
              sx={{ borderColor: 'divider', borderRadius: 999, flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              {sortDirection === 'ascending' ? 'A → Z' : 'Z → A'}
            </Button>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label={resultLabel}
            size="small"
            sx={{ alignSelf: 'center', display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {displayedTeams.length === 0 ? (
        <Stack alignItems="center" spacing={0.5} sx={{ px: 2, py: 6, textAlign: 'center' }}>
          <SearchIcon color="disabled" sx={{ fontSize: 36 }} />
          <Typography fontWeight={700}>Aucune équipe trouvée</Typography>
          <Typography color="text.secondary" variant="body2">
            Essayez avec un autre nom ou effacez la recherche.
          </Typography>
        </Stack>
      ) : (
        <Box
          component="ul"
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
            listStyle: 'none',
            m: 0,
            p: { xs: 2, sm: 2.5 },
          }}
        >
          {displayedTeams.map((team) => (
            <Paper
              component="li"
              data-team-name={team.name}
              key={team.id}
              variant="outlined"
              sx={{
                alignItems: 'center',
                borderRadius: 2.5,
                display: 'flex',
                gap: 1.5,
                minHeight: 76,
                p: 1.5,
                transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                '&:hover': { borderColor: 'text.secondary', boxShadow: 2, transform: 'translateY(-1px)' },
                '&:hover .team-actions, &:focus-within .team-actions': { opacity: 1 },
              }}
            >
              <Avatar
                aria-hidden="true"
                sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 16, fontWeight: 900 }}
              >
                {team.name.trim().charAt(0).toLocaleUpperCase('fr')}
              </Avatar>
              <Typography fontWeight={750} sx={{ flex: 1, minWidth: 0 }} noWrap>
                {team.name}
              </Typography>
              <Stack
                className="team-actions"
                direction="row"
                spacing={0.5}
                sx={{ flexShrink: 0, opacity: { xs: 1, md: 0.45 }, transition: 'opacity 160ms ease' }}
              >
                <Tooltip title="Modifier">
                  <IconButton aria-label={`Editer ${team.name}`} onClick={() => onEdit(team)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <Box component="span" sx={{ display: 'inline-flex' }}>
                    <DeleteButton ariaLabel={`Supprimer ${team.name}`} onConfirm={() => onDelete(team)} />
                  </Box>
                </Tooltip>
              </Stack>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  )
}
