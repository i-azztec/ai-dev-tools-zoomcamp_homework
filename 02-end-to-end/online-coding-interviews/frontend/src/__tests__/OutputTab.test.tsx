import { render, screen } from '@testing-library/react';
import OutputTab from '@/components/room/OutputTab';

test('renders success output', () => {
  render(<OutputTab isRunning={false} result={{ output: 'Hello', error: null, executionTime: 10 }} />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
  expect(screen.getByText(/Completed in 10ms/i)).toBeInTheDocument();
});

test('renders error output', () => {
  render(<OutputTab isRunning={false} result={{ output: '', error: 'Boom', executionTime: 5 }} />);
  expect(screen.getByText('Boom')).toBeInTheDocument();
});

