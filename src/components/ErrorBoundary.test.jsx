import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

let shouldThrow = true;

function Bomb({ message = 'boom' }) {
  if (shouldThrow) throw new Error(message);
  return <p>child ok</p>;
}

describe('ErrorBoundary', () => {
  let consoleError;

  beforeEach(() => {
    shouldThrow = true;
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders children when nothing throws', () => {
    shouldThrow = false;
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText('child ok')).toBeInTheDocument();
    expect(screen.queryByText('Failed to render output')).not.toBeInTheDocument();
  });

  it('shows the fallback UI with the error message when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb message="bad markdown" />
      </ErrorBoundary>
    );
    expect(screen.getByText('Failed to render output')).toBeInTheDocument();
    expect(screen.getByText('Error: bad markdown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.queryByText('child ok')).not.toBeInTheDocument();
  });

  it('falls back to a generic message when the thrown value has no string form', () => {
    function NullThrower() {
      throw { toString: () => '' };
    }
    render(
      <ErrorBoundary>
        <NullThrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Unknown rendering error')).toBeInTheDocument();
  });

  it('logs the caught error instead of swallowing it', () => {
    render(
      <ErrorBoundary>
        <Bomb message="observable" />
      </ErrorBoundary>
    );
    const call = consoleError.mock.calls.find(
      (args) => args[0] === 'ErrorBoundary caught an error:'
    );
    expect(call).toBeDefined();
    expect(call[1]).toBeInstanceOf(Error);
    expect(call[1].message).toBe('observable');
    expect(call[2]).toHaveProperty('componentStack');
  });

  it('Try Again re-renders children once the cause is fixed', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('child ok')).toBeInTheDocument();
    expect(screen.queryByText('Failed to render output')).not.toBeInTheDocument();
  });

  it('Try Again shows the fallback again if the child still throws', async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <Bomb message="still broken" />
      </ErrorBoundary>
    );
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Error: still broken')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });
});
