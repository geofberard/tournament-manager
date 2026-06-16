import { createContext } from 'react';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

export type AlertContextType = {
  showAlert: (message: string, severity?: AlertSeverity) => void;
};

export const AlertContext = createContext<AlertContextType | null>(null);
