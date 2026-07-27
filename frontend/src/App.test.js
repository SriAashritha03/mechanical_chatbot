import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the chatbot interface', () => {
  render(<App />);
  expect(screen.getByText(/Simple frontend for your backend chatbot/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Ask the assistant/i })).toBeInTheDocument();
});
