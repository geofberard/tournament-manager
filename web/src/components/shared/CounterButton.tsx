import { Button } from "@mui/material";

type CounterButtonProps = {
  action: string
  teamId: string
  onChangeScore: (teamId: string, delta: number) => void
}

export const CounterButton = ({action, teamId, onChangeScore}: CounterButtonProps) => {
  const onClickAction = () => {
    action === "add"
    ? onChangeScore(teamId, 1)
    : onChangeScore(teamId, -1)
  }

  const sxButton = action === "add"
    ? {
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '36px',
        fontWeight: 700,
        '&:hover': { backgroundColor: '#45A049' },
      }
    : {
        width: 40,
        height: 65,
        borderRadius: '50%',
        backgroundColor: '#f44336cf',
        color: 'white',
        fontSize: '36px',
        fontWeight: 700,
        '&:hover': { backgroundColor: '#D32F2F' },
      }

  return (
    <Button
      sx={sxButton}
      onClick={onClickAction}
    >
    {action === "add" ? "+" : "-"}
    </Button>
  );
}