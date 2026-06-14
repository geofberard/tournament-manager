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
  const sxPaper = (theme: Theme) => ({
    width: '100%',
    flex: 1,
    p: 3,
    textAlign: 'center',
    borderRadius: '20px',
    border: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
    ...(highlight && {
      borderColor: theme.palette.secondary.main,
      backgroundColor: theme.palette.action.selected,
    }),
  })

  const sxBox = (theme: Theme) => ({
    p: 2,
    borderRadius: theme.shape.borderRadius,
    mb: 2,
    backgroundColor: highlight ? theme.palette.background.default : theme.palette.action.hover,
  })

  const sxTeamName = (theme: Theme) => ({
    fontWeight: 700,
    color: theme.palette.text.primary,
  })

  const sxScoreText = (theme: Theme) => ({
    fontWeight: 900,
    fontSize: '4.5rem',
    lineHeight: 1,
    mb: 2,
    color: highlight ? theme.palette.primary.dark : theme.palette.text.primary,
  })

  const sxIcon = (theme: Theme) => ({
    color: highlight ? theme.palette.secondary.main : theme.palette.text.secondary,
  })

  const onClickAction = (action: "add" | "remove") => {
    onChangeScore(team.id, action === "add" ? 1 : -1)
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