import {
  getByDisplayValue,
  getByLabelText,
  getByTestId,
  getByText,
  queryByLabelText,
  queryByText,
} from '@testing-library/dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Home, { RequestOptions, ResistorValues } from '../../pages/index.tsx';

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

test('3rd digit select can be enabled & have a value selected', async () => {
  const { container } = render(<Home />);

  expect(queryByLabelText(container, '3rd Digit')).not.toBeInTheDocument();

  userEvent.click(getByText(container, 'Extended 5-Bands'));

  expect(getByLabelText(container, '3rd Digit')).toBeInTheDocument();

  const select = getByLabelText(container, '3rd Digit');

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

  userEvent.click(getByText(container, 'Extended 5-Bands'));

  expect(getByTestId(container, 'calculate-buton').attributes).toHaveProperty('aria-disabled');

  const thirdSelect = getByLabelText(container, '3rd Digit');

  userEvent.selectOptions(thirdSelect, [getByText(thirdSelect, 'black')]);

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
  expect(getByText(container, 'This color is not valid for this band')).toBeInTheDocument();
});

test('values return by server calculation are shown', async () => {
  const values: ResistorValues = {
    baseResistance: 20,
    tolerance: 10,
    maxResistance: 22,
    mixResistance: 18,
  };
  function request(options: RequestOptions<Record<string, string>>): ResistorValues {
    return values;
  }

  const { container } = render(<Home request={request} />);

  const firstSelect = getByLabelText(container, '1st Digit');
  userEvent.selectOptions(firstSelect, [getByText(firstSelect, 'black')]);

  const secondSelect = getByLabelText(container, '2nd Digit');
  userEvent.selectOptions(secondSelect, [getByText(secondSelect, 'black')]);

  const exponentSelect = getByLabelText(container, "10's Exponent");
  userEvent.selectOptions(exponentSelect, [getByText(exponentSelect, 'black')]);

  userEvent.click(getByTestId(container, 'calculate-buton'));

  await waitFor(() => expect(queryByText(container, 'Values')));

  expect(getByText(container, 'Values')).toBeInTheDocument();
  expect(getByDisplayValue(container, values.baseResistance)).toBeInTheDocument();
  expect(getByDisplayValue(container, values.tolerance)).toBeInTheDocument();
  expect(getByDisplayValue(container, values.maxResistance)).toBeInTheDocument();
  expect(getByDisplayValue(container, values.mixResistance)).toBeInTheDocument();
});

test('reset button resets form state to default values', async () => {
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

  userEvent.click(getByTestId(container, 'reset-buton'));

  expect(queryByText(container, 'This color is not valid for this band')).not.toBeInTheDocument();
  expect(getByTestId(container, 'calculate-buton').attributes).toHaveProperty('aria-disabled');
  expect(queryByText(container, 'Values')).not.toBeInTheDocument();
  expect(getByText(firstSelect, 'Select a color').selected).toBe(true);
  expect(getByText(secondSelect, 'Select a color').selected).toBe(true);
  expect(getByText(exponentSelect, 'Select a color').selected).toBe(true);
});
