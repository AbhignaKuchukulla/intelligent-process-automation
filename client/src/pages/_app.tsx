             import type { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { ToastProvider } from '../components/Toast/ToastProvider';
import { CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default MUI blue
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
      <Head>
        <title>Intelligent Process Automation</title>
        <meta name="description" content="AI-driven business process automation system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/logo.svg" />
      </Head>

        <CssBaseline />
        <Navbar />
        <main>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Component {...pageProps} />
          </Container>
        </main>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default MyApp;
