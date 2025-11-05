import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type ToastOptions = {
  message: string;
  severity?: AlertColor;
  duration?: number;
};

type ToastContextType = {
  showToast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [duration, setDuration] = useState(4000);

  const showToast = useCallback((opts: ToastOptions) => {
    setMessage(opts.message);
    setSeverity(opts.severity || 'info');
    setDuration(opts.duration ?? 4000);
    setOpen(true);
  }, []);

  // Register global notifier so non-React modules can trigger toasts
  useEffect(() => {
    try {
      // require here to avoid ESM/CJS cycle issues in the build
      const { setNotify } = require('../../utils/notifier');
      if (setNotify) setNotify(showToast);
      return () => {
        if (setNotify) setNotify(null);
      };
    } catch (e) {
      // ignore if notifier not available in this environment
    }
  }, [showToast]);

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
