import { Box, ButtonBase, Stack, TextField, Tooltip, Typography } from '@mui/material'
import type { FormEvent, KeyboardEvent, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Game } from '../../services/gamesService'

type EditableGameScoreProps = {
  game: Game
  onSave: (pointsByTeam: Record<string, number>) => Promise<void>
}

type FocusedTeam = 'team1' | 'team2'

const getScoreValue = (game: Game, teamId: string) => game.score?.pointsByTeam?.[teamId]

const toInputValue = (score?: number) => (score === undefined ? '' : String(score))

const isValidScore = (value: string) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value))

export const EditableGameScore = ({ game, onSave }: EditableGameScoreProps) => {
  const contestants = Array.from(game.contestants)
  const team1 = contestants[0]
  const team2 = contestants[1]
  const team1ScoreValue = team1 ? getScoreValue(game, team1.id) : undefined
  const team2ScoreValue = team2 ? getScoreValue(game, team2.id) : undefined
  const hasScore = team1ScoreValue !== undefined || team2ScoreValue !== undefined
  const initialTeam1Score = toInputValue(team1ScoreValue)
  const initialTeam2Score = toInputValue(team2ScoreValue)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [team1Score, setTeam1Score] = useState(initialTeam1Score)
  const [team2Score, setTeam2Score] = useState(initialTeam2Score)
  const [focusedTeam, setFocusedTeam] = useState<FocusedTeam>('team1')
  const team1InputRef = useRef<HTMLInputElement>(null)
  const team2InputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setTeam1Score(initialTeam1Score)
      setTeam2Score(initialTeam2Score)
    }
  }, [initialTeam1Score, initialTeam2Score, isEditing])

  useEffect(() => {
    if (!isEditing) {
      return
    }

    const input = focusedTeam === 'team1' ? team1InputRef.current : team2InputRef.current
    input?.focus()
    input?.select()
  }, [focusedTeam, isEditing])

  const stopRowClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  const cancelEdition = () => {
    setTeam1Score(initialTeam1Score)
    setTeam2Score(initialTeam2Score)
    setHasError(false)
    setIsEditing(false)
  }

  const startEdition = (event: MouseEvent<HTMLElement>, team: FocusedTeam) => {
    stopRowClick(event)
    setHasError(false)
    setFocusedTeam(team)
    setIsEditing(true)
  }

  const saveScore = async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!team1 || !team2 || !isValidScore(team1Score) || !isValidScore(team2Score)) {
      setHasError(true)
      return
    }

    setHasError(false)
    setIsSaving(true)

    try {
      await onSave({
        [team1.id]: Number(team1Score),
        [team2.id]: Number(team2Score),
      })
      setIsEditing(false)
    } catch {
      setHasError(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelEdition()
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.requestSubmit()
    }
  }

  if (!isEditing) {
    return hasScore ? (
      <Stack alignItems="center" direction="row" justifyContent="center" spacing={0.25}>
        <ButtonBase
          aria-label={`Modifier le score de ${team1?.name ?? 'equipe 1'}`}
          onClick={(event) => startEdition(event, 'team1')}
          onMouseDown={stopRowClick}
          sx={{ borderRadius: 1, minHeight: 28, minWidth: 28 }}
        >
          {initialTeam1Score || '-'}
        </ButtonBase>
        <Typography>-</Typography>
        <ButtonBase
          aria-label={`Modifier le score de ${team2?.name ?? 'equipe 2'}`}
          onClick={(event) => startEdition(event, 'team2')}
          onMouseDown={stopRowClick}
          sx={{ borderRadius: 1, minHeight: 28, minWidth: 28 }}
        >
          {initialTeam2Score || '-'}
        </ButtonBase>
      </Stack>
    ) : (
      <ButtonBase
        aria-label={`Modifier le score de ${team1?.name ?? 'equipe 1'} contre ${team2?.name ?? 'equipe 2'}`}
        onClick={(event) => startEdition(event, 'team1')}
        onMouseDown={stopRowClick}
        sx={{ borderRadius: 1, minHeight: 32, px: 1 }}
      >
        ∅
      </ButtonBase>
    )
  }

  return (
    <Tooltip
      open={hasError}
      placement="top"
      title={hasError ? "Impossible d'enregistrer ce score." : ''}
    >
      <Box
        component="form"
        onClick={stopRowClick}
        onKeyDown={handleKeyDown}
        onMouseDown={stopRowClick}
        onSubmit={saveScore}
      >
        <Stack alignItems="center" direction="row" spacing={0.25}>
          <TextField
            disabled={isSaving}
            error={hasError}
            inputRef={team1InputRef}
            onChange={(event) => setTeam1Score(event.target.value)}
            size="small"
            slotProps={{
              htmlInput: {
                'aria-label': `Score ${team1?.name ?? 'equipe 1'}`,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
            }}
            type="text"
            value={team1Score}
            sx={{ width: 46 }}
          />
          <Typography aria-hidden>-</Typography>
          <TextField
            disabled={isSaving}
            error={hasError}
            inputRef={team2InputRef}
            onChange={(event) => setTeam2Score(event.target.value)}
            size="small"
            slotProps={{
              htmlInput: {
                'aria-label': `Score ${team2?.name ?? 'equipe 2'}`,
                inputMode: 'numeric',
                pattern: '[0-9]*',
              },
            }}
            type="text"
            value={team2Score}
            sx={{ width: 46 }}
          />
        </Stack>
        {hasError ? (
          <Box
            component="span"
            role="alert"
            sx={{
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: 1,
              overflow: 'hidden',
              position: 'absolute',
              width: 1,
            }}
          >
            Impossible d&apos;enregistrer ce score.
          </Box>
        ) : null}
      </Box>
    </Tooltip>
  )
}
