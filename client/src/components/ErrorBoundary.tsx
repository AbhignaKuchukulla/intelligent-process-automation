'use client';

import { Component, ErrorInfo, PropsWithChildren } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { notify } from '@/utils/notifier';

interface Props {
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  constructor(props: PropsWithChildren<Props>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    notify({ 
      message: 'An unexpected error occurred. Our team has been notified.',
      severity: 'error'
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper 
          sx={{ 
            p: 4, 
            m: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="h5" color="error">
            Something went wrong
          </Typography>
          <Typography color="text.secondary">
            We apologize for the inconvenience. Please try refreshing the page.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}