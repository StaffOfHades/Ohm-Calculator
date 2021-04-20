import type { AppProps, AppComponent } from 'next/app'
import '../styles/globals.sass'

const MainApp: AppComponent = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MainApp
