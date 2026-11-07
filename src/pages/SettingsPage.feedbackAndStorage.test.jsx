import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  saveGlobalKeys: vi.fn(),
  actualSaveGlobalKeys: null,
  clearAutomationKeys: vi.fn(),
}))

vi.mock('../lib/globalKeys', async (importOriginal) => {
  const actual = await importOriginal()
  mocks.actualSaveGlobalKeys = actual.saveGlobalKeys
  return { ...actual, saveGlobalKeys: (...args) => mocks.saveGlobalKeys(...args) }
})
vi.mock('../lib/automationsService', () => ({ clearAutomationKeys: mocks.clearAutomationKeys }))

import SettingsPage from './SettingsPage'
import { getGlobalKeys } from '../lib/globalKeys'

function renderSettings() {
  return render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
  mocks.saveGlobalKeys.mockImplementation((...args) => mocks.actualSaveGlobalKeys(...args))
  mocks.clearAutomationKeys.mockResolvedValue(0)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Settings feedback and storage handling', () => {
  it('sets and clears the default provider, then removes timed feedback', () => {
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout')
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai', anthropic: 'sk-anthropic' })
    renderSettings()

    const defaultSelect = screen.getByLabelText('Default provider')
    fireEvent.change(defaultSelect, { target: { value: 'openai' } })
    expect(screen.getByRole('status')).toHaveTextContent('Default provider set to OpenAI.')
    expect(getGlobalKeys().defaultProvider).toBe('openai')

    fireEvent.change(defaultSelect, { target: { value: '' } })
    expect(screen.getByRole('status')).toHaveTextContent('Default provider cleared.')
    expect(getGlobalKeys().defaultProvider).toBe('')
    expect(clearSpy).toHaveBeenCalled()

    const timers = timeoutSpy.mock.calls.filter((call) => call[1] === 5000)
    expect(timers.length).toBeGreaterThan(0)
    expect(screen.getByText('Default provider cleared.', { selector: 'span' })).toBeInTheDocument()
    act(() => timers.at(-1)[0]())
    expect(
      screen.queryByText('Default provider cleared.', { selector: 'span' })
    ).not.toBeInTheDocument()
  })

  it('clears the default preference and reports one scheduled job copy', async () => {
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })
    mocks.clearAutomationKeys.mockResolvedValue(1)
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear OpenAI key' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Key and 1 scheduled job copy cleared.')
    )
    expect(
      screen.getByText('Save at least one API key above to set a default provider.')
    ).toBeInTheDocument()
    expect(getGlobalKeys().defaultProvider).toBe('')
  })

  it('reports a save exception instead of a success message', () => {
    mocks.saveGlobalKeys.mockImplementation(() => {
      throw new Error('storage denied')
    })
    renderSettings()

    fireEvent.change(screen.getByLabelText('OpenAI API key'), {
      target: { value: 'sk-openai' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Keys could not be saved. Check that browser storage is available and try again.'
    )
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('reports a rejected scheduled-job cleanup after clearing one key', async () => {
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai' })
    mocks.clearAutomationKeys.mockRejectedValue(new Error('jobs unavailable'))
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear OpenAI key' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'Key cleared, but scheduled job credentials could not be removed.'
      )
    )
  })

  it('reports a rejected scheduled-job cleanup after clearing all keys', async () => {
    mocks.actualSaveGlobalKeys({ openai: 'sk-openai', defaultProvider: 'openai' })
    mocks.clearAutomationKeys.mockRejectedValue(new Error('jobs unavailable'))
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All Keys' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear all' }))

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'All saved keys cleared, but scheduled job credentials could not be removed.'
      )
    )
  })
})
