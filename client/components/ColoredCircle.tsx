import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

interface ColoredCircleProps {
  className: string;
  color: string;
}

export default function ColoredCirlce({ className, color }: ColoredCircleProps) {
  return (
    <p className={classNames('has-text-centered', className)}>
      <span
        className="icon"
        style={{
          border: `${2}px solid ${color === '' ? 'gainsboro' : 'black'}`,
          borderRadius: 290486 + 'px',
          color,
        }}
      >
        {color === '' ? <Fragment /> : <FontAwesomeIcon icon={faCircle} />}
      </span>
    </p>
  );
}
