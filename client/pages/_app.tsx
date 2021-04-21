import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import Head from 'next/head';

// Add global styles to app, including fontawesome & bulma.
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/globals.sass';

export default function MainApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}
