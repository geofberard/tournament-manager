import { CircularProgress, Stack, Typography } from '@mui/material'

type LoadingStateProps = {
  message: string
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <CircularProgress size={24} />
      <Typography>{message}</Typography>
    </Stack>
  )
}
