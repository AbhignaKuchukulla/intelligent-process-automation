import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeProviderClient from '@/theme/ThemeProviderClient';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Container } from '@mui/material';
// themeOptions -> used inside client ThemeProvider
import { ToastProvider } from '@/components/Toast/ToastProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intelligent Process Automation',
  description: 'AI-driven business process automation system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProviderClient>
            <ToastProvider>
              <Navbar />
              <Container
                component="main"
                maxWidth="lg"
                sx={{
                  mt: 4,
                  mb: 6,
                  minHeight: 'calc(100vh - 64px)', // Account for navbar height
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {children}
              </Container>
            </ToastProvider>
          </ThemeProviderClient>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}