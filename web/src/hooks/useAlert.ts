import { useContext } from 'react';
import { AlertContext } from '../app/AlertContext';

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert doit être utilisé à l'intérieur d'un AlertProvider");
  }
  return context;
};