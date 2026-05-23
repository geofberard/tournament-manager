import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Router } from './app/Router'

const defaultTheme = createTheme()

const theme = createTheme(defaultTheme, {
  palette: {
    primary: {
      light: '#484848',
      main: '#212121',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffeb90',
      main: '#dcb961',
      dark: '#a88933',
      contrastText: '#000000',
    },
    success: {
      light: '#81c784',
      main: '#4CAF50',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    danger: {
      light: '#f44336cf',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    info: {
      light: '#2196F3',
      main: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 900,
      [defaultTheme.breakpoints.up('md')]: {
        fontSize: '2.8rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 900,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 900,
      alignSelf: 'center',
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  </StrictMode>,
)
