import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { faCalculator, faUndo } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <section className="section has-background-light" style={{ minHeight: 100 + 'vh' }}>
      <Head>
        <title>Ohm Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div
          className="card"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 720 + 'px' }}
        >
          <header className="card-header">
            <p className="card-header-title">Ohm Calculator</p>
            <button className="card-header-icon">
              <span className="icon">
                <FontAwesomeIcon icon={faUndo} />
              </span>
            </button>
          </header>
          <div className="card-content">
            <div className="content"></div>
          </div>
          <footer className="card-footer">
            <a className="card-footer-item">
              <span className="icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faUndo} />
                </span>
                <span>Reset</span>
              </span>
            </a>
            <a className="card-footer-item">
              <span className="icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faCalculator} />
                </span>
                <span>Calculate</span>
              </span>
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
