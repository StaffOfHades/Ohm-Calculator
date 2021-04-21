import { getByLabelText, getByTestId, getByText } from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home from '../../pages/index.tsx';

test('loads initial page', async () => {
  const { container } = render(<Home />);

  expect(getByText(container, 'Ohm Calculator')).toBeInTheDocument();
  expect(getByText(container, 'Reset')).toBeInTheDocument();
  expect(getByTestId(container, 'calculate-buton')).toBeInTheDocument();
});

test('loads 1st digit select properly', async () => {
  const { container } = render(<Home />);

  const select = getByLabelText(container, '1st Digit');

  expect(select).toBeInTheDocument();
  expect(getByText(select, 'black')).toBeInTheDocument();
  expect(getByText(select, 'Select a color').selected).toBe(true);
});

test('1st digit select can have a value selected', async () => {
  const { container } = render(<Home />);

  const select = getByLabelText(container, '1st Digit');

  userEvent.selectOptions(select, [getByText(select, 'black')]);

  expect(getByText(select, 'black').selected).toBe(true);
});

test('form prevents sending data until required fields are selected', async () => {
  const { container } = render(<Home />);

  expect(getByTestId(container, 'calculate-buton').attributes).toHaveProperty('disabled');

  const firstSelect = getByLabelText(container, '1st Digit');
  userEvent.selectOptions(firstSelect, [getByText(firstSelect, 'black')]);

  const secondSelect = getByLabelText(container, '2nd Digit');
  userEvent.selectOptions(secondSelect, [getByText(secondSelect, 'black')]);

  const exponentSelect = getByLabelText(container, "10's Exponent");
  userEvent.selectOptions(exponentSelect, [getByText(exponentSelect, 'black')]);

  expect(getByTestId(container, 'calculate-buton').attributes).not.toHaveProperty('disabled');
});
