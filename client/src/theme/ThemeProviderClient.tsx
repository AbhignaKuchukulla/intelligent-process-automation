"use client";

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme';

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  const theme = React.useMemo(() => createTheme(themeOptions), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
