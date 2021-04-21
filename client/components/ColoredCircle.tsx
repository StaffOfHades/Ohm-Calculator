import { Fragment, Props } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export default function ColoredCirlce({ className, color }: Props) {
  return (
    <div className={classNames('column', 'has-text-centered', className)}>
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
    </div>
  );
}
