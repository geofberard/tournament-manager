import { Box, Stack, Button } from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { type Game } from "../../services/apiClient"
import { useEffect, useRef, useState } from "react"
import { CounterBox } from "./CounterBox"

type GameCounterProps = {
  game: Game
}

const buildGameStateStorageKey = (gameId: string | undefined) => {
  return gameId ? `tournament-game-state-${gameId}` : null
}

export const GameCounter = ({ game }: GameCounterProps) => {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [lastTeamPoint, setLastTeamPoint] = useState<string | null>(null)
  const [switchSides, setSwitchSides] = useState<boolean>(false)

  const isFirstRender = useRef(true)
  const contestants = Array.from(game?.contestants ?? []);
  const gameStateStorageKey = buildGameStateStorageKey(game?.id)

  // Load initial state from localStorage, or fallback to game score if available
  useEffect(() => {
    handleGameStateInitialLoad()
    handleSwitchSidesInitialLoad()
  }, [])

  // Persist state to localStorage on changes (except for the initial load)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!gameStateStorageKey) {
      return
    }

    globalThis.localStorage.setItem(
      gameStateStorageKey,
      JSON.stringify({ scores, lastTeamPoint }),
    )
  }, [scores])

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

  const handleGameStateInitialLoad = () => {
    if (!gameStateStorageKey) {
      return
    }

    const gameStateStored = globalThis.localStorage.getItem(gameStateStorageKey)

    if (!gameStateStored) {
      setScores(game?.score?.pointsByTeam)
      return
    }

    const parsed = JSON.parse(gameStateStored) as {
      scores?: Record<string, number>
      lastTeamPoint?: string | null
    }

    setScores(parsed.scores ?? game?.score?.pointsByTeam ?? {})
    setLastTeamPoint(parsed.lastTeamPoint ?? null)
  }

  const handleSwitchSidesInitialLoad = () => {
    const switchSidesStored = globalThis.localStorage.getItem(`${gameStateStorageKey}-switch-sides`)
    
    if (!switchSidesStored) {
      return
    }

    setSwitchSides(switchSidesStored === 'true')
  }

  const handleSwitchSides = () => {
    setSwitchSides((prev) => !prev)
    globalThis.localStorage.setItem(`${gameStateStorageKey}-switch-sides`, JSON.stringify(!switchSides))
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
