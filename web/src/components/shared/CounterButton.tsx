import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { Theme } from "@mui/material/styles";

type CounterButtonProps = {
  action: "add" | "remove"
  onClick: () => void
}

export const CounterButton = ({action, onClick}: CounterButtonProps) => {

  const sxButton = {
    borderRadius: '50%',
    fontWeight: (theme: Theme) => theme.typography.h1.fontWeight,
    fontSize: (theme: Theme) => theme.typography.h1.fontSize,
    width: action === "add" ? 80 : 40,
    height: action === "add" ? 80 : 65,
    backgroundColor: (theme: Theme) => action === "add"
      ? theme.palette.success.main
      : theme.palette.error.main,
    color: (theme: Theme) => action === "add"
      ? theme.palette.success.contrastText
      : theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: (theme: Theme) => action === "add"
        ? theme.palette.success.dark
        : theme.palette.error.dark,
    },
  }

  return (
    <Button
      sx={sxButton}
      onClick={onClick}
      aria-label={action === "add" ? "+" : "-"}
      title={action === "add" ? "Ajouter" : "Retirer"}
    >
      {action === "add" ? <AddIcon /> : <RemoveIcon />}
    </Button>
  );
}