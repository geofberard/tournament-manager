import { Grid } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { TeamLoginBanner } from '../components/team-login/TeamLoginBanner'
import { TeamLoginCard } from '../components/team-login/TeamLoginCard'
import { useTeams } from '../hooks/useTeams'
import type { Team } from '../services/teamsService'

type TeamSelectionViewProps = {
  onTeamChange: (teams: Team[], event: SelectChangeEvent<string>) => void
}

export function TeamSelectionView({ onTeamChange }: TeamSelectionViewProps) {
  const { errorMessage, isLoading, teams } = useTeams()

  return (
    <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
      <TeamLoginBanner />

      <Grid
        size={{ xs: 12, md: 7 }}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          px: 2,
          py: { xs: 2, md: 4 },
          minHeight: { xs: 'calc(100vh - 96px)', md: '100vh' },
        }}
      >
        <TeamLoginCard
          currentTeam={null}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onTeamChange={(event) => onTeamChange(teams, event)}
          teams={teams}
        />
      </Grid>
    </Grid>
  )
}
