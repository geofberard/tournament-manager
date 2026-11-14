import { Chip, keyframes, type SxProps, type Theme } from '@mui/material'

type LiveChipProps = {
  label?: string
  sx?: SxProps<Theme>
}

const pulseAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
`

export const LiveChip = ({ label = 'En direct', sx }: LiveChipProps) => (
  <Chip
    size="small"
    color="success"
    label={label}
    sx={[
      { height: 22, fontWeight: 600, animation: `${pulseAnimation} 2s ease-in-out infinite` },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
)
