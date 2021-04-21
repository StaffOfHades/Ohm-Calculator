import { getByLabelText, getByTestId, getByText, queryByText } from '@testing-library/dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home, { RequestOptions } from '../../pages/index.tsx';

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

  expect(getByTestId(container, 'calculate-buton').attributes).toHaveProperty('aria-disabled');

  const firstSelect = getByLabelText(container, '1st Digit');
  userEvent.selectOptions(firstSelect, [getByText(firstSelect, 'black')]);

  const secondSelect = getByLabelText(container, '2nd Digit');
  userEvent.selectOptions(secondSelect, [getByText(secondSelect, 'black')]);

  const exponentSelect = getByLabelText(container, "10's Exponent");
  userEvent.selectOptions(exponentSelect, [getByText(exponentSelect, 'black')]);

  expect(getByTestId(container, 'calculate-buton').attributes).not.toHaveProperty('aria-disabled');
});

test('form prevents sending data until required fields are selected', async () => {
  const { container } = render(<Home />);

  expect(getByTestId(container, 'calculate-buton').attributes).toHaveProperty('aria-disabled');

  const firstSelect = getByLabelText(container, '1st Digit');
  userEvent.selectOptions(firstSelect, [getByText(firstSelect, 'black')]);

  const secondSelect = getByLabelText(container, '2nd Digit');
  userEvent.selectOptions(secondSelect, [getByText(secondSelect, 'black')]);

  const exponentSelect = getByLabelText(container, "10's Exponent");
  userEvent.selectOptions(exponentSelect, [getByText(exponentSelect, 'black')]);

  expect(getByTestId(container, 'calculate-buton').attributes).not.toHaveProperty('aria-disabled');
});

test('help message is shown if an invalid field colors is returned', async () => {
  function request(options: RequestOptions<Record<string, string>>): Promise<Array<string>> {
    return ['exponentBand'];
  }

  const { container } = render(<Home request={request} />);

  const firstSelect = getByLabelText(container, '1st Digit');
  userEvent.selectOptions(firstSelect, [getByText(firstSelect, 'black')]);

  const secondSelect = getByLabelText(container, '2nd Digit');
  userEvent.selectOptions(secondSelect, [getByText(secondSelect, 'black')]);

  const exponentSelect = getByLabelText(container, "10's Exponent");
  userEvent.selectOptions(exponentSelect, [getByText(exponentSelect, 'black')]);

  userEvent.click(getByTestId(container, 'calculate-buton'));

  await waitFor(() => expect(queryByText(container, 'This color is not valid for this band')));
  expect(queryByText(container, 'This color is not valid for this band')).toBeInTheDocument();
});
