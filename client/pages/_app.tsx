import type { AppProps } from 'next/app';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.sass';

export default function MainApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
