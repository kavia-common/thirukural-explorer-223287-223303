import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const title = screen.getByText(/Thirukural Explorer/i);
  expect(title).toBeInTheDocument();
});

test('renders subtitle', () => {
  render(<App />);
  const subtitle = screen.getByText(/Discover timeless couplets and their meaning/i);
  expect(subtitle).toBeInTheDocument();
});
