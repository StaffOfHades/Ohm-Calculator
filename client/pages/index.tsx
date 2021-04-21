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

interface FieldColumnProps {
  className: string;
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

interface ResistorValues {
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
  if (response.status === 400) {
    const { invalidFields }: { invalidFields: Array<string> } = data;
    return invalidFields;
  }
  if (response.status === 200) return data;
  return null;
}

function FieldColumn({ className, invalid, label, name, setter, value }: FieldColumnProps) {
  return (
    <div className={classNames('column', className)}>
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
    </div>
  );
}

function HorizontalField({ addon, label, value }: HorizontalFieldProps) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className={classNames('field', { 'has-addons': addon !== undefined })}>
          <div className={classNames('control', { 'is-expanded': addon !== undefined })}>
            <input className="input" readonly value={value} />
          </div>
          {addon !== undefined ? (
            <div class="control">
              <a class="button is-static">{addon}</a>
            </div>
          ) : (
            <Fragment />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home({ request = defaultRequest }: HomeProps) {
  const [exponentBand, setExponentBand] = useState<Colors | ''>('');
  const [firstBand, setFirstBand] = useState<Colors | ''>('');
  const [secondBand, setSecondBand] = useState<Colors | ''>('');
  const [thirdBand, setThirdBand] = useState<Colors | ''>('');
  const [toleranceBand, setToleranceBand] = useState<Colors | ''>('');
  const [useThirdBand, setUseThirdBand] = useState(false);
  const [resistorValues, setResistorValues] = useState<ResistorValues | null>(null);
  const [invalidBands, setInvalidBands] = useState<Array<string>>([]);

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

  const isValid =
    firstBand !== '' &&
    secondBand !== '' &&
    (useThirdBand ? thirdBand !== '' : true) &&
    exponentBand !== '';

  function resetBands() {
    (Object.keys(bands) as Array<keyof typeof bands>).forEach((key) => bands[key]?.setter(''));
    setInvalidBands([]);
    setResistorValues(null);
  }

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
      if (data === null || !isResistorValues(data)) {
        if (data !== null) setInvalidBands(data);
        setResistorValues(null);
        return;
      }
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
                {(Object.keys(bands) as Array<keyof typeof bands>).map((key) => (
                  <ColoredCirlce
                    className={classNames({
                      'is-one-fourth': !useThirdBand,
                      'is-one-fifth': useThirdBand,
                    })}
                    color={bands[key]?.value ?? ''}
                    key={key}
                  />
                ))}
              </div>
              <div className="columns">
                {(Object.keys(bands) as Array<keyof typeof bands>).map((key) => (
                  <FieldColumn
                    className={classNames({
                      'is-one-fourth': !useThirdBand,
                      'is-one-fifth': useThirdBand,
                    })}
                    invalid={invalidBands.includes(key)}
                    key={key}
                    label={bands[key]!.label}
                    name={key}
                    setter={bands[key]!.setter}
                    value={bands[key]!.value}
                  />
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
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 720 + 'px' }}
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
                <HorizontalField addon="%" label="Tolerance" value={resistorValues.tolerance} />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Base)"
                  value={resistorValues.baseResistance}
                />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Max)"
                  value={resistorValues.maxResistance}
                />
                <HorizontalField
                  addon="ohms"
                  label="Resistance (Min)"
                  value={resistorValues.mixResistance}
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
