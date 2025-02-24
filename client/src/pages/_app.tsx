import { AppProps } from 'next/app';
import "../styles/";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
