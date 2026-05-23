import { Box, Paper, Stack, Typography } from "@mui/material"
import type { Team } from "../../generated/api-client"
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { CounterButton } from "./CounterButton";

type CounterBoxProps = {
  team: Team
  score: number
  highlight: boolean
  onChangeScore: (teamId: string, delta: number) => void
}

export const CounterBox = ({ team, score, highlight, onChangeScore }: CounterBoxProps) =>{
  return (
    <Paper sx={{ width:'100%', flex: 1, backgroundColor: highlight ? '#dcb96167' : '#ffffff', p: 3, textAlign: 'center' }}>
      <Box sx={{ backgroundColor: highlight ? '#ffffff' : '#90CAF9', p: 1.5, borderRadius: 1, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
          {highlight ? <SportsVolleyballIcon sx={{ color: '#dcb961', fontSize: 30 }} /> : null}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: highlight ? '#dcb961' : '#ffffff' }}>
            {team.name}
          </Typography>
        </Stack>
      </Box>
      <Typography variant="h1" sx={{ fontWeight: 900, fontSize: '80px', mb: 2, color: '#1A237E' }}>
        {score}
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <CounterButton onChangeScore={onChangeScore} teamId={team.id} action="add"/>
        <CounterButton onChangeScore={onChangeScore} teamId={team.id} action="remove"/>
      </Stack>
    </Paper>
  )
}