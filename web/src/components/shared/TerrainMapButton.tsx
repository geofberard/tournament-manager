import { Button, Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MapIcon from '@mui/icons-material/Map'
import { useState } from 'react'
import mapImage from '../../assets/map.png'

export const TerrainMapButton = () => {
  const [isMapOpen, setIsMapOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-label="Voir le plan des terrains"
        onClick={() => setIsMapOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 102,
          right: 16,
          zIndex: 1000,
          padding: '10px',
          margin: 0,
          minWidth: 0,
        }}
      >
        <MapIcon sx={{ height: '50px', width: '50px' }} />
      </Button>

      <Dialog open={isMapOpen} onClose={() => setIsMapOpen(false)} maxWidth="md" fullWidth>
        <IconButton
          aria-label="fermer"
          onClick={() => setIsMapOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4, pt: 6 }}>
          <img
            src={mapImage}
            alt="Plan des terrains"
            style={{ display: 'block', height: 'auto', maxWidth: '100%' }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
