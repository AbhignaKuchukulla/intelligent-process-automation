import type { AppProps } from 'next/app';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Intelligent Process Automation</title>
        <meta name="description" content="AI-driven business process automation system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}

export default MyApp;