import { Button, Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import { useState } from 'react'
import foodImage from '../../assets/food.png'

export const BuvetteButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        aria-label="Voir le menu de la buvette"
        onClick={() => setIsMenuOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 188,
          right: 16,
          zIndex: 1000,
          padding: '10px',
          margin: 0,
          minWidth: 0,
        }}
      >
        <LocalDiningIcon sx={{ height: '50px', width: '50px' }} />
      </Button>

      <Dialog open={isMenuOpen} onClose={() => setIsMenuOpen(false)} maxWidth="sm" fullWidth>
        <IconButton
          aria-label="fermer"
          onClick={() => setIsMenuOpen(false)}
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
            src={foodImage}
            alt="Menu de la buvette"
            style={{ display: 'block', height: 'auto', maxHeight: '75vh', maxWidth: '100%', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
