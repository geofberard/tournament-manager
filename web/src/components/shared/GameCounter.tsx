import { Box, Stack, Button, Typography } from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import SaveIcon from '@mui/icons-material/Save';
import { type Game, type Team } from "../../services/apiClient"
import { CounterBox } from "./CounterBox"
import { usePersistedState } from "../../hooks/usePersistedState"
import type { Theme } from "@mui/material/styles";
import { upsertGameScore } from '../../services/gamesService'
import { useNavigate } from "react-router-dom";
import { useAlert } from '../../hooks/useAlert';

type GameCounterProps = {
  game: Game
}

export const GameCounter = ({ game }: GameCounterProps) => {
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    `tournament-game-${game.id}-scores`, 
    game?.score?.pointsByTeam ?? {}
  )
  const [lastTeamPoint, setLastTeamPoint] = usePersistedState(
    `tournament-game-${game.id}-last-team-point`,
    null as string | null
  )
  const [switchSides, setSwitchSides] = usePersistedState(
    `tournament-game-${game.id}-switch-sides`,
    false as boolean
  )

  const { showAlert } = useAlert();
  const contestants = Array.from(game?.contestants ?? [])

  const updateScore = (teamId: string, delta: number) => {
    const current = scores[teamId] ?? 0
    const next = Math.max(0, current + delta)

    setScores({
      ...scores,
      [teamId]: next,
    })

    if (delta > 0) {
      setLastTeamPoint(teamId)
    }
  }

  const handleSwitchSides = () => {
    const nextSwitchSides = !switchSides
    setSwitchSides(nextSwitchSides)
  }

  const navigate = useNavigate()

  const handleSaveScores = async () => {
    try {
      await upsertGameScore(game.id, scores)
      showAlert('Score enregistré avec succes', 'success');
      navigate('/team/games', {
        replace: true,
      })
    } catch (error) {
      showAlert('Une erreur est survenue lors de la sauvegarde du score.', 'error');
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1 }}>
        <Typography width={{ xs: "100%", sm: "70%" }} sx={{ fontWeight: 500, fontSize: "0.875rem", fontFamily: (t: Theme) => t.typography.fontFamily }}>
          Renseignez les scores pour chaque équipe. Cliquez sur "Valider le score" une fois le match terminé.
        </Typography>
        <Stack
          display={{xs: "none", sm: "flex"}}
          alignItems="center"
          flexWrap="wrap"
          spacing={1}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapHorizIcon />}
            onClick={handleSwitchSides}
            sx={{ textTransform: "none" }}
          >
            changer de côté
          </Button>
        </Stack>
      </Stack>

      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
        alignItems="stretch"
      >
        {(switchSides ? contestants.toReversed() : contestants).map((team: Team) => (
          <Box key={team.id} sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
            <CounterBox
              team={team}
              score={(scores && scores[team.id]) ?? 0}
              highlight={lastTeamPoint === team.id}
              onChangeScore={updateScore}
            />
          </Box>
        ))}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        spacing={1}
      >
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={handleSaveScores}
        >
          Valider le score
        </Button>
      </Stack>
    </Stack>
  )
}
