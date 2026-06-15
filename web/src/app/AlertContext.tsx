import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { SnackbarCloseReason } from '@mui/material';

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

type AlertContextType = {
  showAlert: (message: string, severity?: AlertSeverity) => void;
};

type AlertState = {
  open: boolean;
  message: string;
  severity: AlertSeverity;
};

export const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showAlert = useCallback((message: string, severity: AlertSeverity = 'info') => {
    setAlert({ open: true, message, severity });
  }, []);

  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event> | undefined,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Snackbar
        open={alert.open}
        autoHideDuration={10000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={alert.severity} 
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
