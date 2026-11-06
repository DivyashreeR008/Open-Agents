import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SettingsPage from './SettingsPage'
import { getGlobalKeys, saveGlobalKeys } from '../lib/globalKeys'

const { clearAutomationKeys } = vi.hoisted(() => ({
  clearAutomationKeys: vi.fn(),
}))

vi.mock('../lib/automationsService', () => ({ clearAutomationKeys }))

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
  clearAutomationKeys.mockReset()
  clearAutomationKeys.mockResolvedValue(0)
})

describe('Settings feedback and keyboard behaviour', () => {
  it('announces save outcomes through a persistent status region', () => {
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Save Keys' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'No keys were saved. Enter a key for at least one provider.'
    )
  })

  it('announces a completed key clear without moving focus', async () => {
    saveGlobalKeys({ openai: 'sk-openai-test' })
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear OpenAI key' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear OpenAI key' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Key cleared.')
    })
    expect(getGlobalKeys().openai).toBe('')
  })

  it('exposes the reveal toggle as a pressed button tied to its input', () => {
    renderSettings()

    const toggle = screen.getByRole('button', { name: 'Show OpenAI API key' })
    const input = screen.getByLabelText('OpenAI API key')

    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'api-key-openai')
    expect(input).toHaveAttribute('type', 'password')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveAttribute('title', 'Hide OpenAI API key')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('moves focus into the clear-all confirmation and back on Escape', () => {
    saveGlobalKeys({ openai: 'sk-openai-test' })
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All Keys' }))

    const confirm = screen.getByRole('button', { name: 'Yes, clear all' })
    expect(confirm).toHaveFocus()

    fireEvent.keyDown(confirm, { key: 'Escape' })

    expect(screen.queryByRole('button', { name: 'Yes, clear all' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear All Keys' })).toHaveFocus()
  })

  it('completes clear-all with the keyboard and returns focus to the trigger', async () => {
    saveGlobalKeys({ openai: 'sk-openai-test' })
    renderSettings()

    fireEvent.click(screen.getByRole('button', { name: 'Clear All Keys' }))
    fireEvent.click(screen.getByRole('button', { name: 'Yes, clear all' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(
        'All saved keys and the default provider preference cleared.'
      )
    })
    expect(getGlobalKeys().openai).toBe('')
    expect(screen.getByRole('button', { name: 'Clear All Keys' })).toHaveFocus()
  })
})
