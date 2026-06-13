import AddIcon from '@mui/icons-material/Add'
import { Box, Fab, Tooltip } from '@mui/material'

type AdminCreateFabProps = {
  disabled?: boolean
  label: string
  onClick: () => void
}

export const AdminCreateFab = ({ disabled = false, label, onClick }: AdminCreateFabProps) => {
  return (
    <Tooltip arrow placement="left" title={label}>
      <Box
        component="span"
        sx={{
          bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 24 },
          position: 'fixed',
          right: { xs: 16, sm: 24 },
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <Fab aria-label={label} color="primary" disabled={disabled} onClick={onClick}>
          <AddIcon />
        </Fab>
      </Box>
    </Tooltip>
  )
}
