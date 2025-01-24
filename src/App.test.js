import { render, screen } from '@testing-library/react';
import App from './App';

test('renders QLE selector heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Select Your Qualifying Life Event/i);
  expect(headingElement).toBeInTheDocument();
});
