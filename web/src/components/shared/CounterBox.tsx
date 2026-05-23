import { Box, Paper, Stack, Typography } from "@mui/material"
import type { Team } from "../../generated/api-client"
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { CounterButton } from "./CounterButton";
import type { Theme } from "@mui/material/styles";

type CounterBoxProps = {
  team: Team
  score: number
  highlight: boolean
  onChangeScore: (teamId: string, delta: number) => void
}

export const CounterBox = ({ team, score, highlight, onChangeScore }: CounterBoxProps) => {
  const themeValue = (highlightFn: (t: Theme) => any, normalFn: (t: Theme) => any) =>
    (theme: Theme) => highlight ? highlightFn(theme) : normalFn(theme)

  const sxPaper = {
    width: '100%',
    flex: 1,
    backgroundColor: themeValue(
      (t) => t.palette.secondary.main,
      (t) => t.palette.background.paper,
    ),
    p: 3,
    textAlign: 'center',
  }

  const sxBox = {
    backgroundColor: themeValue(
      (t) => t.palette.background.paper,
      (t) => t.palette.info.light,
    ),
    p: 1.5,
    borderRadius: 1,
    mb: 2,
  }

  const sxTeamName = {
    fontWeight: 700,
    color: themeValue(
      (t) => t.palette.secondary.main,
      (t) => t.palette.info.contrastText,
    ),
  }

  const sxScoreText = {
    fontWeight: 900,
    fontSize: '80px',
    mb: 2,
    color: themeValue(
      (t) => t.palette.secondary.contrastText,
      (t) => t.palette.info.dark,
    ),
  }

  const sxIcon = {
    color: highlight ? (theme: Theme) => theme.palette.secondary.main : null,
  }

  const onClickAction = (action: "add" | "remove") => {
    action === "add"
    ? onChangeScore(team.id, 1)
    : onChangeScore(team.id, -1)
  }

  return (
    <Paper sx={sxPaper}>
      <Box sx={sxBox}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
          {highlight ? <SportsVolleyballIcon sx={sxIcon} /> : null}
          <Typography variant="subtitle1" sx={sxTeamName}>
            {team.name}
          </Typography>
        </Stack>
      </Box>
      <Typography variant="h1" sx={sxScoreText}>
        {score}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <CounterButton onClick={() => onClickAction("add")} action="add"/>
        <CounterButton onClick={() => onClickAction("remove")} action="remove"/>
      </Stack>
    </Paper>
  )
}