import AddIcon from '@mui/icons-material/Add'
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import { useState, type ReactNode } from 'react'

export type AdminCreateSpeedDialAction = {
  icon: ReactNode
  label: string
  onClick: () => void
}

type AdminCreateSpeedDialProps = {
  actions: AdminCreateSpeedDialAction[]
  disabled?: boolean
  label: string
}

export const AdminCreateSpeedDial = ({
  actions,
  disabled = false,
  label,
}: AdminCreateSpeedDialProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SpeedDial
      ariaLabel={label}
      FabProps={{ disabled }}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      sx={{
        bottom: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 24 },
        position: 'fixed',
        right: { xs: 16, sm: 24 },
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          icon={action.icon}
          key={action.label}
          onClick={() => {
            setIsOpen(false)
            action.onClick()
          }}
          slotProps={{ tooltip: { title: action.label } }}
        />
      ))}
    </SpeedDial>
  )
}
