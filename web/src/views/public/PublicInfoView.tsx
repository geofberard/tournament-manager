import { useState, type ReactNode } from 'react'
import { usePublicLayout } from '../../hooks/usePublicLayout'
import {
  Box,
  Card,
  CardActionArea,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import MapIcon from '@mui/icons-material/Map'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import mapImage from '../../assets/map.png'
import foodImage from '../../assets/food.png'
import qrCodeImage from '../../assets/qrcode.png'

type InfoItem = {
  key: string
  title: string
  description: string
  icon: ReactNode
  content: ReactNode
}

const imageStyle = { display: 'block', height: 'auto', maxWidth: '100%', margin: '0 auto', borderRadius: 8 }

const infoItems: InfoItem[] = [
  {
    key: 'map',
    title: 'Plan des terrains',
    description: 'Où se trouve chaque terrain',
    icon: <MapIcon />,
    content: <img src={mapImage} alt="Plan des terrains" style={imageStyle} />,
  },
  {
    key: 'food',
    title: 'Buvette',
    description: 'Menu et prix',
    icon: <LocalDiningIcon />,
    content: <img src={foodImage} alt="Menu de la buvette" style={{ ...imageStyle, maxHeight: '75vh' }} />,
  },
  {
    key: 'share',
    title: 'Partager le tournoi',
    description: 'QR code à scanner',
    icon: <QrCode2Icon />,
    content: (
      <>
        <img src={qrCodeImage} alt="QR Code du tournoi" style={imageStyle} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Scannez ce QR code pour suivre le tournoi sur votre téléphone.
        </Typography>
      </>
    ),
  },
]

export const PublicInfoView = () => {
  const [openedItemKey, setOpenedItemKey] = useState<string | null>(null)
  const openedItem = infoItems.find((item) => item.key === openedItemKey)
  const { isLargeScreen } = usePublicLayout()

  return (
    <>
      {isLargeScreen ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3 }}>
          {infoItems.map((item) => (
            <Card key={item.key} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardActionArea onClick={() => setOpenedItemKey(item.key)} sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ '& .MuiSvgIcon-root': { fontSize: 48 } }}>{item.icon}</Box>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>{item.title}</Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 3, maxWidth: 640, mx: 'auto' }}>
          <List disablePadding>
            {infoItems.map((item, index) => (
              <div key={item.key}>
                {index > 0 && <Divider component="div" />}
                <ListItemButton onClick={() => setOpenedItemKey(item.key)} sx={{ py: 2 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                    slotProps={{ primary: { fontWeight: 600 } }}
                  />
                  <ChevronRightIcon color="action" />
                </ListItemButton>
              </div>
            ))}
          </List>
        </Card>
      )}

      <Dialog open={Boolean(openedItem)} onClose={() => setOpenedItemKey(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>{openedItem?.title}</DialogTitle>
        <IconButton
          aria-label="fermer"
          onClick={() => setOpenedItemKey(null)}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>{openedItem?.content}</DialogContent>
      </Dialog>
    </>
  )
}
