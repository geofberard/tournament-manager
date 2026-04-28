import { useState } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import type { Team } from '../services/teamsService'
import {
  clearCurrentTeam,
  getCurrentTeam,
  setCurrentTeam as persistCurrentTeam,
} from '../services/currentTeamService'

type UseTeamLoginResult = {
  currentTeam: Team | null
  handleTeamChange: (teams: Team[], event: SelectChangeEvent<string>) => void
}

const findSelectedTeam = (teams: Team[], teamId: string) =>
  teams.find((team) => team.id === teamId) ?? null

export function useTeamLogin(): UseTeamLoginResult {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => getCurrentTeam())

  const handleTeamChange = (teams: Team[], event: SelectChangeEvent<string>) => {
    const selectedTeam = findSelectedTeam(teams, event.target.value)

    setCurrentTeam(selectedTeam)

    if (selectedTeam) {
      persistCurrentTeam(selectedTeam)
      return
    }

    clearCurrentTeam()
  }

  return {
    currentTeam,
    handleTeamChange,
  }
}
