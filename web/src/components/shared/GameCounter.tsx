import { Box, Stack, Button } from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { type Game } from "../../services/apiClient"
import { useEffect, useMemo, useRef, useState } from "react"
import { CounterBox } from "./CounterBox"
import { useLocalStorage } from "../../hooks/useLocalStorage"

type GameCounterProps = {
  game: Game
}

export const GameCounter = ({ game }: GameCounterProps) => {
  const { setLocalGameState, getLocalGameState, setLocalSwitchSides, getLocalSwitchSides } = useLocalStorage()
  const isFirstRender = useRef(true)
  const contestants = Array.from(game?.contestants ?? [])

  const initialGameState = useMemo(() => {
    const stored = getLocalGameState(game)
    if (!stored) {
      return undefined
    }

    try {
      return JSON.parse(stored) as {
        scores?: Record<string, number>
        lastTeamPoint?: string | null
      }
    } catch {
      return undefined
    }
  }, [game, getLocalGameState])

  const initialSwitchSides = useMemo(() => {
    const stored = getLocalSwitchSides(game)
    if (!stored) {
      return false
    }

    try {
      return (JSON.parse(stored) as { switchSides: boolean }).switchSides === true
    } catch {
      return false
    }
  }, [game, getLocalSwitchSides])

  const [scores, setScores] = useState<Record<string, number>>(
    () => initialGameState?.scores ?? game?.score?.pointsByTeam ?? {}
  )
  const [lastTeamPoint, setLastTeamPoint] = useState<string | null>(
    () => initialGameState?.lastTeamPoint ?? null
  )
  const [switchSides, setSwitchSides] = useState<boolean>(() => initialSwitchSides)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setLocalGameState(game, scores, lastTeamPoint)
  }, [game, scores, lastTeamPoint, setLocalGameState])

  const updateScore = (teamId: string, delta: number) => {
    setScores((prev) => {
      const current = prev[teamId] ?? 0
      const next = Math.max(0, current + delta)

      return {
        ...prev,
        [teamId]: next,
      }
    })

    if (delta > 0) {
      setLastTeamPoint(teamId)
    }
  }

  const handleSwitchSides = () => {
    setSwitchSides((prev) => {
      const next = !prev
      setLocalSwitchSides(game, next)
      return next
    })
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
        {(switchSides ? contestants.toReversed() : contestants).map((team: any) => (
          <Box key={team.id} sx={{ flex: 1, minWidth: { xs: "100%", sm: 280 } }}>
            <CounterBox
              team={team}
              score={(scores && scores[team.id]) ?? 0}
              lastTeamPoint={lastTeamPoint === team.id}
              onChangeScore={updateScore}
            />
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
