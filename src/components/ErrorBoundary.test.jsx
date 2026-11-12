import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary, { isStorageFailure } from './ErrorBoundary'

let shouldThrow = true

function Bomb({ message = 'boom' }) {
  if (shouldThrow) throw new Error(message)
  return <p>child ok</p>
}

describe('ErrorBoundary', () => {
  let consoleError

  beforeEach(() => {
    shouldThrow = true
    localStorage.clear()
    sessionStorage.clear()
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders children when nothing throws', () => {
    shouldThrow = false
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )
    expect(screen.getByText('child ok')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('shows a neutral fallback without blaming generated content', () => {
    render(
      <ErrorBoundary>
        <Bomb message="bad markdown" />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByText(/this screen could not be displayed/i)).toBeInTheDocument()
    expect(screen.getByText('Error: bad markdown')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
    expect(screen.queryByText(/AI generated content/i)).not.toBeInTheDocument()
    expect(screen.queryByText('child ok')).not.toBeInTheDocument()
  })

  it('uses output-specific copy only for the output variant', () => {
    render(
      <ErrorBoundary variant="output">
        <Bomb message="renderer failed" />
      </ErrorBoundary>
    )

    expect(
      screen.getByRole('heading', { name: 'Could not display this output' })
    ).toBeInTheDocument()
    expect(screen.getByText(/generated response could not be rendered/i)).toBeInTheDocument()
  })

  it('recognizes storage and JSON failures without treating every error as storage', () => {
    expect(isStorageFailure(new Error('Unexpected token < in JSON at position 0'))).toBe(true)
    expect(isStorageFailure(new Error('localStorage is unavailable'))).toBe(true)
    expect(
      isStorageFailure(Object.assign(new Error('quota'), { name: 'QuotaExceededError' }))
    ).toBe(true)
    expect(isStorageFailure(new Error('Cannot read properties of undefined'))).toBe(false)
    expect(isStorageFailure(null)).toBe(false)
  })

  it('offers storage recovery actions instead of a deterministic retry', () => {
    render(
      <ErrorBoundary>
        <Bomb message="localStorage returned malformed data" />
      </ErrorBoundary>
    )

    expect(
      screen.getByRole('heading', { name: 'Saved data could not be read' })
    ).toBeInTheDocument()
    expect(screen.getByText(/browser storage error stopped this screen/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear saved data' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument()
  })

  it('runs the injected reload action', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()

    render(
      <ErrorBoundary onReload={onReload}>
        <Bomb message="plain failure" />
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: 'Reload page' }))

    expect(onReload).toHaveBeenCalledTimes(1)
  })

  it('requires confirmation before clearing saved data and then reloads', async () => {
    const user = userEvent.setup()
    const onReload = vi.fn()
    localStorage.setItem('oa_theme', 'light')
    sessionStorage.setItem('session-key', 'secret')

    render(
      <ErrorBoundary onReload={onReload}>
        <Bomb message="localStorage is unavailable" />
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: 'Clear saved data' }))
    expect(screen.getByText(/removes API keys, automations, preferences/i)).toBeInTheDocument()
    expect(localStorage.getItem('oa_theme')).toBe('light')
    expect(onReload).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Yes, clear and reload' }))

    expect(localStorage.getItem('oa_theme')).toBeNull()
    expect(sessionStorage.getItem('session-key')).toBeNull()
    expect(onReload).toHaveBeenCalledTimes(1)
  })

  it('can cancel the clear confirmation without touching storage', async () => {
    const user = userEvent.setup()
    localStorage.setItem('oa_theme', 'dark')

    render(
      <ErrorBoundary>
        <Bomb message="localStorage is unavailable" />
      </ErrorBoundary>
    )

    await user.click(screen.getByRole('button', { name: 'Clear saved data' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('button', { name: 'Yes, clear and reload' })).not.toBeInTheDocument()
    expect(localStorage.getItem('oa_theme')).toBe('dark')
  })

  it('falls back to a neutral diagnostic when the thrown value has no string form', () => {
    function NullThrower() {
      throw { toString: () => '' }
    }
    render(
      <ErrorBoundary>
        <NullThrower />
      </ErrorBoundary>
    )
    expect(screen.getByText('Unknown error')).toBeInTheDocument()
  })

  it('logs the caught error instead of swallowing it', () => {
    render(
      <ErrorBoundary>
        <Bomb message="observable" />
      </ErrorBoundary>
    )
    const call = consoleError.mock.calls.find(
      (args) => args[0] === 'ErrorBoundary caught an error:'
    )
    expect(call).toBeDefined()
    expect(call[1]).toBeInstanceOf(Error)
    expect(call[1].message).toBe('observable')
    expect(call[2]).toHaveProperty('componentStack')
  })

  it('Try Again re-renders children once the cause is fixed', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )
    shouldThrow = false
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByText('child ok')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('Try Again shows the fallback again if the child still throws', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary>
        <Bomb message="still broken" />
      </ErrorBoundary>
    )
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByText('Error: still broken')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })
})
