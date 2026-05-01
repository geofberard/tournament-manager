import { Box, CardMedia, Grid, Typography } from '@mui/material'
import scufLogo from '../../assets/scuf-logo.svg'

export const TeamLoginBanner = () => {
  return (
    <Grid
      size={{ xs: 12, md: 5 }}
      container
      direction={{ xs: 'row', md: 'column-reverse' }}
      justifyContent={{ xs: 'flex-start', md: 'center' }}
      alignItems={{ xs: 'center', md: 'center' }}
      sx={{
        backgroundColor: 'primary.dark',
        color: 'primary.contrastText',
        px: { xs: 2, md: 5 },
        py: { xs: 1.5, md: 6 },
        height: { xs: '96px', md: '100vh' },
        minHeight: { xs: '96px', md: '100vh' },
        maxHeight: { xs: '96px', md: 'none' },
        gap: { xs: 1.5, md: 0 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={scufLogo}
          alt="SCUF"
          sx={{ width: { xs: '56px', md: '250px' } }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: { xs: 1, md: 'initial' },
          pb: { xs: 0, md: '30px' },
          borderBottom: {
            xs: 'none',
            md: (theme) => `5px solid ${theme.palette.secondary.main}`,
          },
        }}
      >
        <Typography
          variant="h1"
          sx={{
            textAlign: 'left',
            lineHeight: 1,
            fontSize: { xs: '1.5rem', md: '2.8rem' },
          }}
        >
          Tournois
        </Typography>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'block' } }} />
    </Grid>
  )
}
