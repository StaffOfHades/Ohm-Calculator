import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import classNames from 'classnames';
import { faCalculator, faCircle as fasCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';

enum Colors {
  Pink = 'pink',
  Silver = 'silver',
  Gold = 'gold',
  Black = 'black',
  Brown = 'brown',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
  Green = 'green',
  Blue = 'blue',
  Violet = 'violet',
  Grey = 'grey',
  White = 'white',
}

interface ResistorBands {
  exponentBand: Colors;
  firstBand: Colors;
  secondBand: Colors;
  thirdBand?: Colors;
  toleranceBand?: Colors;
}

export default function Home() {
  const [exponentBand, setExponentBand] = useState<Colors | ''>('');
  const [firstBand, setFirstBand] = useState<Colors | ''>('');
  const [secondBand, setSecondBand] = useState<Colors | ''>('');
  const [thirdBandBand, setThirdBand] = useState<Colors | ''>('');
  const [toleranceBand, setToleranceBand] = useState<Colors | ''>('');
  const [useThirdBand, setUseThirdBand] = useState(false);
  const bands = {
    exponentBand: {
      value: exponentBand,
      setter: setExponentBand,
    },
    firstBand: {
      value: firstBand,
      setter: setFirstBand,
    },
    secondBand: {
      value: secondBand,
      setter: setSecondBand,
    },
    toleranceBand: {
      value: toleranceBand,
      setter: setToleranceBand,
    },
    ...(useThirdBand
      ? {
          thirdBand: {
            value: thirdBand,
            setter: setThirdBand,
          },
        }
      : {}),
  };

  function resetBands() {
    Object.keys(bands).forEach((key) => bands[key].setter(''));
  }

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
            <button className="card-header-icon" onClick={resetBands}>
              <span className="icon">
                <FontAwesomeIcon icon={faUndo} />
              </span>
            </button>
          </header>
          <div className="card-content">
            <div className="content">
              <div className="columns">
                {Object.keys(bands).map((key) => (
                  <div
                    className={classNames('column', 'has-text-centered', {
                      'is-one-fourth': !useThirdBand,
                      'is-one-fifth': useThirdBand,
                    })}
                    key={key}
                  >
                    <span
                      className="icon"
                      style={{
                        border: `${2}px solid ${bands[key].value === '' ? 'gainsboro' : 'black'}`,
                        borderRadius: 290486 + 'px',
                        color: bands[key].value,
                      }}
                    >
                      {bands[key].value === '' ? (
                        <Fragment />
                      ) : (
                        <FontAwesomeIcon icon={fasCircle} />
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="columns">
                {Object.keys(bands).map((key) => (
                  <div
                    className={classNames('column', {
                      'is-one-fourth': !useThirdBand,
                      'is-one-fifth': useThirdBand,
                    })}
                    key={key}
                  >
                    <div className="field">
                      <div className="control is-expanded">
                        <div
                          className={classNames('select', 'is-fullwidth', {
                            'is-empty': bands[key].value === '',
                          })}
                        >
                          <select
                            value={bands[key].value}
                            onChange={(event) => bands[key].setter(event.target.value)}
                          >
                            <option disabled value="" hidden>
                              Select a color
                            </option>
                            {Object.keys(Colors).map((key) => (
                              <option key={Colors[key]} value={Colors[key]}>
                                {Colors[key]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer className="card-footer">
            <a className="card-footer-item" onClick={resetBands}>
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
