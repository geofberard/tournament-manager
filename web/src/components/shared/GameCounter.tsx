import { Box, Stack, Button } from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { type Game, type Team } from "../../services/apiClient"
import { useEffect, useMemo, useRef, useState } from "react"
import { CounterBox } from "./CounterBox"
import { usePersistedState } from "../../hooks/usePersistedState"

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

  const handleSaveScores = () => {
    // TODO : handle upsertGameScore
  }

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        display={{xs: "none", sm: "flex"}}
        alignItems="center"
        justifyContent="flex-end"
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
    </Stack>
  )
}
