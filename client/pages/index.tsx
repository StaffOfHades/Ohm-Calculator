import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment, useState } from 'react';
import Head from 'next/head';
import classNames from 'classnames';
import { faCalculator, faUndo } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import ColoredCirlce from '../components/ColoredCircle';

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

export interface RequestOptions<D> {
  data: D;
  url: string;
  method: 'GET' | 'POST';
}

interface ColorFieldProps {
  invalid: boolean;
  label: string;
  name: string;
  setter: Function;
  value: Colors | '';
}

interface HorizontalFieldProps {
  addon?: string;
  label: string;
  value: string;
}

interface ResistorBands {
  exponentBand: Colors;
  firstBand: Colors;
  secondBand: Colors;
  thirdBand?: Colors;
  toleranceBand?: Colors;
}

export interface ResistorValues {
  baseResistance: number;
  maxResistance: number;
  mixResistance: number;
  tolerance: number;
}

interface HomeProps {
  request?(
    options: RequestOptions<Record<string, string>>
  ): Promise<ResistorValues | Array<string> | null>;
}

// Default request associated with this component that takes options
// to return either the resistor values or the invalid fields.
async function defaultRequest(
  options: RequestOptions<Record<string, string>>
): Promise<ResistorValues | Array<string> | null> {
  const response = await fetch(options.url, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options.data),
  });
  const data = await response.json();

  // When response is 400, the invalid fields where returned.
  if (response.status === 400) {
    const { invalidFields }: { invalidFields: Array<string> } = data;
    return invalidFields;
  }

  // When the response is 200, the resistor values where returned
  if (response.status === 200) return data;

  // In all other cases, an error ocurred communicating with server.
  return null;
}

// Creates a field component using bulma framework design using given props
// that allows selecting one of the colors defined above.
function ColorField({ invalid, label, name, setter, value }: ColorFieldProps) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="control is-expanded">
        <div
          className={classNames(
            'select',
            'is-fullwidth',
            {
              'is-empty': value === '',
            },
            {
              'is-danger': invalid,
            }
          )}
        >
          <select
            id={name}
            name={name}
            value={value}
            onChange={(event) => setter(event.target.value)}
          >
            <option disabled value="" hidden>
              Select a color
            </option>
            {(Object.keys(Colors) as Array<keyof typeof Colors>).map((key) => (
              <option key={Colors[key]} value={Colors[key]}>
                {Colors[key]}
              </option>
            ))}
          </select>
        </div>
      </div>
      {invalid ? (
        <p className="help is-danger">This color is not valid for this band</p>
      ) : (
        <Fragment />
      )}
    </div>
  );
}

// Creates a horizontal field component using bulma framework design using given props
// with optional addon to define a static label at the end of the input
function HorizontalField({ addon, label, value }: HorizontalFieldProps) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className={classNames('field', { 'has-addons': addon !== undefined })}>
          <div className={classNames('control', { 'is-expanded': addon !== undefined })}>
            <input className="input" readOnly value={value} />
          </div>
          {addon !== undefined ? (
            <div className="control">
              <a className="button is-static">{addon}</a>
            </div>
          ) : (
            <Fragment />
          )}
        </div>
      </div>
    </div>
  );
}

// Creates a home page component using bulma framework that is responsible for
// creating calculator form to select a series of colors, validating inputs,
// sending to server & showing results.
export default function Home({ request = defaultRequest }: HomeProps) {
  // Define state used by component
  const [exponentBand, setExponentBand] = useState<Colors | ''>('');
  const [firstBand, setFirstBand] = useState<Colors | ''>('');
  const [secondBand, setSecondBand] = useState<Colors | ''>('');
  const [thirdBand, setThirdBand] = useState<Colors | ''>('');
  const [toleranceBand, setToleranceBand] = useState<Colors | ''>('');
  const [useThirdBand, setUseThirdBand] = useState(false);
  const [resistorValues, setResistorValues] = useState<ResistorValues | null>(null);
  const [invalidBands, setInvalidBands] = useState<Array<string>>([]);

  // Create an object wrapper over some state used by app to allow accessing them
  // as dictionary.
  const bands = {
    firstBand: {
      label: '1st Digit',
      value: firstBand,
      setter: setFirstBand,
    },
    secondBand: {
      label: '2nd Digit',
      value: secondBand,
      setter: setSecondBand,
    },
    ...(useThirdBand
      ? {
          thirdBand: {
            label: '3rd Digit',
            value: thirdBand,
            setter: setThirdBand,
          },
        }
      : {}),
    exponentBand: {
      label: "10's Exponent",
      value: exponentBand,
      setter: setExponentBand,
    },
    toleranceBand: {
      label: 'Tolerence',
      value: toleranceBand,
      setter: setToleranceBand,
    },
  };

  // Computed value that determined if form contains valid values.
  const isValid =
    firstBand !== '' &&
    secondBand !== '' &&
    (useThirdBand ? thirdBand !== '' : true) &&
    exponentBand !== '';

  // Reset app state to its intial values
  function resetBands() {
    (Object.keys(bands) as Array<keyof typeof bands>).forEach((key) => bands[key]?.setter(''));
    setInvalidBands([]);
    setResistorValues(null);
  }

  // Helper function to send request to server & validate what data was recieved
  async function calculateValues() {
    function isResistorValues(values: ResistorValues | Array<string>): values is ResistorValues {
      return 'baseResistance' in values;
    }

    try {
      const data = await request({
        url: 'http://localhost:5000/calculate-values',
        method: 'POST',
        data: (Object.keys(bands) as Array<keyof typeof bands>).reduce((values, key) => {
          const value = bands[key]?.value;
          if (value !== undefined && value !== '') values[key] = value;
          return values;
        }, {} as Record<string, string>),
      });
      // If data is invalid or not the resistor values, show field erros & reset resistor values
      if (data === null || !isResistorValues(data)) {
        if (data !== null) setInvalidBands(data);
        setResistorValues(null);
        return;
      }

      // Otherwise, set the passed resistor values to state.
      setInvalidBands([]);
      setResistorValues(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="section has-background-light" style={{ minHeight: 100 + 'vh' }}>
      <Head>
        <title>Ohm Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div
          className="card block"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 1080 + 'px' }}
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
            <div className="tabs">
              <ul>
                <li
                  className={useThirdBand ? undefined : 'is-active'}
                  onClick={() => setUseThirdBand(false)}
                >
                  <a>Standard 4-Bands</a>
                </li>
                <li
                  className={useThirdBand ? 'is-active' : undefined}
                  onClick={() => setUseThirdBand(true)}
                >
                  <a>Extended 5-Bands</a>
                </li>
              </ul>
            </div>
            <div className="content">
              <div className="columns is-multiline">
                {(Object.keys(bands) as Array<keyof typeof bands>).map((key) => (
                  <div
                    className={classNames('column', 'is-full-tablet', {
                      'is-one-fourth-desktop': !useThirdBand,
                      'is-one-fifth-desktop': useThirdBand,
                    })}
                    key={key}
                    style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 + 'px' }}
                  >
                    <ColoredCirlce color={bands[key]?.value ?? ''} key={key} />
                    <ColorField
                      invalid={invalidBands.includes(key)}
                      label={bands[key]!.label}
                      name={key}
                      setter={bands[key]!.setter}
                      value={bands[key]!.value}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer className="card-footer">
            <a
              className="card-footer-item"
              data-testid="reset-buton"
              role="button"
              onClick={resetBands}
            >
              <span className="icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faUndo} />
                </span>
                <span>Reset</span>
              </span>
            </a>
            {isValid ? (
              <a
                className="card-footer-item"
                data-testid="calculate-buton"
                role="button"
                onClick={calculateValues}
              >
                <span className="icon-text">
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalculator} />
                  </span>
                  <span>Calculate</span>
                </span>
              </a>
            ) : (
              <span
                aria-disabled
                className="card-footer-item"
                data-testid="calculate-buton"
                role="button"
                style={{ cursor: 'not-allowed' }}
              >
                <span className="icon-text">
                  <span className="icon">
                    <FontAwesomeIcon icon={faCalculator} />
                  </span>
                  <span>Calculate</span>
                </span>
              </span>
            )}
          </footer>
        </div>
        {resistorValues !== null ? (
          <div
            className="card block"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 1080 + 'px' }}
          >
            <header className="card-header">
              <p className="card-header-title">Values</p>
              <button
                className="card-header-icon"
                onClick={() => {
                  setResistorValues(null);
                }}
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faTimesCircle} />
                </span>
              </button>
            </header>
            <div className="card-content">
              <div
                className="content"
                style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 400 + 'px' }}
              >
                <HorizontalField
                  addon="%"
                  label="Tolerance"
                  value={resistorValues.tolerance.toString()}
                />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Base)"
                  value={resistorValues.baseResistance.toString()}
                />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Max)"
                  value={resistorValues.maxResistance.toString()}
                />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Min)"
                  value={resistorValues.mixResistance.toString()}
                />
              </div>
            </div>
          </div>
        ) : (
          <Fragment />
        )}
      </div>
    </section>
  );
}
