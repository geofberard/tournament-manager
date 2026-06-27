import type { ChangeEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material'
import { getPhaseStatistics } from '../../services/statisticsService'
import type { Team } from '../../services/teamsService'
import type { Phase } from '../../services/phasesService'
import { PhaseSelect } from './PhaseSelect'

type MultipleTeamSelectProps = {
  onLoadingChange?: (isLoading: boolean) => void
  onSelectedTeamIdsChange: (teamIds: Set<string>) => void
  selectedTeamIds: Set<string>
  teams: Team[]
}

export const MultipleTeamSelect = ({
  onLoadingChange,
  onSelectedTeamIdsChange,
  selectedTeamIds,
  teams,
}: MultipleTeamSelectProps) => {
  const [referencePhaseId, setReferencePhaseId] = useState('')
  const [referencePhaseName, setReferencePhaseName] = useState<string | undefined>()
  const [usedTeamIds, setUsedTeamIds] = useState<Set<string>>(new Set())
  const [isLoadingReferencePhase, setIsLoadingReferencePhase] = useState(false)
  const [referencePhaseError, setReferencePhaseError] = useState<string | null>(null)
  const referencePhaseRequestId = useRef(0)
  const selectableTeamsCount = useMemo(
    () => teams.filter((team) => !usedTeamIds.has(team.id)).length,
    [teams, usedTeamIds],
  )
  const unavailableTeamsCount = usedTeamIds.size

  const setReferencePhaseLoading = (isLoading: boolean) => {
    setIsLoadingReferencePhase(isLoading)
    onLoadingChange?.(isLoading)
  }

  const handleReferencePhaseChange = async (nextReferencePhase?: Phase) => {
    const nextReferencePhaseId = nextReferencePhase?.id ?? ''
    const requestId = referencePhaseRequestId.current + 1
    referencePhaseRequestId.current = requestId
    setReferencePhaseId(nextReferencePhaseId)
    setReferencePhaseName(nextReferencePhase?.name)

    if (!nextReferencePhaseId) {
      setUsedTeamIds(new Set())
      setReferencePhaseError(null)
      setReferencePhaseLoading(false)
      return
    }

    setReferencePhaseLoading(true)
    setReferencePhaseError(null)

    try {
      const statistics = await getPhaseStatistics(nextReferencePhaseId)
      if (referencePhaseRequestId.current !== requestId) {
        return
      }

      const nextUsedTeamIds = new Set(statistics.teams.map((team) => team.id))
      setUsedTeamIds(nextUsedTeamIds)
      onSelectedTeamIdsChange(
        new Set(Array.from(selectedTeamIds).filter((teamId) => !nextUsedTeamIds.has(teamId))),
      )
    } catch {
      if (referencePhaseRequestId.current !== requestId) {
        return
      }

      setUsedTeamIds(new Set())
      setReferencePhaseError("Impossible de recuperer les equipes deja presentes dans cette phase.")
    } finally {
      if (referencePhaseRequestId.current === requestId) {
        setReferencePhaseLoading(false)
      }
    }
  }

  const toggleTeam = (teamId: string) => (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (usedTeamIds.has(teamId)) {
      return
    }

    const teamIds = new Set(selectedTeamIds)
    if (checked) {
      teamIds.add(teamId)
    } else {
      teamIds.delete(teamId)
    }

    onSelectedTeamIdsChange(teamIds)
  }

  return (
    <FormControl
      component="fieldset"
      required
      sx={{ border: 1, borderColor: 'divider', borderRadius: 1, gap: 1.5, p: 2 }}
    >
      <Stack spacing={1.5}>
        <Typography component="legend" fontWeight={800}>
          Equipes
        </Typography>

        <Stack alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
          <PhaseSelect
            allowEmpty
            condensed
            label="Filtrer par phase"
            onChange={handleReferencePhaseChange}
            value={referencePhaseId}
          />
        </Stack>

        <Typography color="text.secondary" variant="body2">
          {referencePhaseId
            ? `${unavailableTeamsCount} equipe${unavailableTeamsCount > 1 ? 's' : ''} indisponible${unavailableTeamsCount > 1 ? 's' : ''} avec ce filtre.`
            : "Aucun filtre applique: toutes les equipes restent disponibles."}
        </Typography>

        {referencePhaseError ? <Alert severity="warning">{referencePhaseError}</Alert> : null}

        <FormGroup>
          {teams.map((team) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedTeamIds.has(team.id)}
                  disabled={usedTeamIds.has(team.id) || isLoadingReferencePhase}
                  onChange={toggleTeam(team.id)}
                />
              }
              key={team.id}
              label={
                <Box>
                  <Typography color={usedTeamIds.has(team.id) ? 'text.disabled' : 'text.primary'}>
                    {team.name}
                  </Typography>
                  {usedTeamIds.has(team.id) && referencePhaseName ? (
                    <Typography color="text.disabled" variant="caption">
                      Deja dans {referencePhaseName}
                    </Typography>
                  ) : null}
                </Box>
              }
              sx={usedTeamIds.has(team.id) ? { color: 'text.disabled' } : undefined}
            />
          ))}
        </FormGroup>
        <FormHelperText>
          {isLoadingReferencePhase
            ? 'Chargement des equipes deja presentes...'
            : `Selectionnez au moins deux equipes.${referencePhaseId ? ` ${selectableTeamsCount} equipe${selectableTeamsCount > 1 ? 's' : ''} disponible${selectableTeamsCount > 1 ? 's' : ''}.` : ''}`}
        </FormHelperText>
      </Stack>
    </FormControl>
  )
}
