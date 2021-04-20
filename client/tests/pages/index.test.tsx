import { render } from '@testing-library/react';

import Home from '../../pages/index.tsx';

test('loads initial page', async () => {
  const { container, getByText } = render(<Home />);

  expect(getByText('Welcome to')).toBeInTheDocument();
});
