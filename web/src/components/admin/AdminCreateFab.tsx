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
          bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 'calc(24px + env(safe-area-inset-bottom))' },
          position: 'fixed',
          right: { xs: 'calc(16px + env(safe-area-inset-right))', sm: 'calc(24px + env(safe-area-inset-right))' },
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
