import { render, screen } from '@testing-library/react';

test('renders a simple component', () => {
  render(<div>Hello, World!</div>);
  const element = screen.getByText(/Hello, World!/i);
  expect(element).toBeInTheDocument();
});
