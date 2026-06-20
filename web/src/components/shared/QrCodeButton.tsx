import { Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material"
import { useState } from "react"
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CloseIcon from '@mui/icons-material/Close';
import qrCode from '../../assets/qrcode.png'

export const QrCodeButton = () => {
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false)

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setIsQrCodeOpen(true)} sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        padding: '10px',
        margin: 0,
        minWidth: 0,
      }}><QrCode2Icon sx={{ height: '50px', width: '50px'}}/></Button>

      <Dialog open={isQrCodeOpen} onClose={() => setIsQrCodeOpen(false)} maxWidth="xs" fullWidth>
        <IconButton
          aria-label="fermer"
          onClick={() => setIsQrCodeOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, pt: 6 }}>
          <img src={qrCode} alt="QR Code du tournoi" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Scannez ce QR code pour accéder au tournoi sur votre téléphone.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}