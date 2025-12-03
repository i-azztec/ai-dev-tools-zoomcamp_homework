import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from '@/components/room/Toolbar';
import { vi } from 'vitest';

test('Run button triggers onRun', async () => {
  const onLanguageChange = vi.fn();
  const onRun = vi.fn();
  render(<Toolbar language="javascript" onLanguageChange={onLanguageChange} onRun={onRun} />);
  const btn = await screen.findByRole('button', { name: /run/i });
  await userEvent.click(btn);
  expect(onRun).toHaveBeenCalledTimes(1);
});
