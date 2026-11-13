import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ApiKeyBar from './ApiKeyBar'
import { MODELS } from '../lib/resolveAgentModel'

function renderBar({
  provider = 'openai',
  apiKey = '',
  saveForSession = false,
  setApiKey = vi.fn(),
}) {
  const model = MODELS[provider][0].value
  return render(
    <MemoryRouter>
      <ApiKeyBar
        provider={provider}
        setProvider={vi.fn()}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveForSession={saveForSession}
        setSaveForSession={vi.fn()}
        agentProvider="any"
        model={model}
        setModel={vi.fn()}
      />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('ApiKeyBar key validation and expiry copy', () => {
  it('marks a mismatched field invalid next to the input', () => {
    const setApiKey = vi.fn()
    renderBar({ apiKey: 'sk-ant-live', setApiKey })

    const input = screen.getByLabelText('API key')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('This looks like an Anthropic key.')

    fireEvent.change(input, { target: { value: 'sk-proj-new' } })
    expect(setApiKey).toHaveBeenCalledWith('sk-proj-new')
  })

  it('states when the saved session key stops working', () => {
    const expiresAt = Date.now() + 60 * 60 * 1000
    sessionStorage.setItem('oa_apikey_openai', JSON.stringify({ key: 'sk-live', expiresAt }))
    renderBar({ apiKey: 'sk-live', saveForSession: true })

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Saved session key expires at')
    expect(status).toHaveTextContent(new Date(expiresAt).toLocaleString())
  })

  it('explains an expired saved key retained as a non-secret marker', () => {
    const expiresAt = Date.now() - 60_000
    sessionStorage.setItem('oa_apikey_expiry_notice_openai', String(expiresAt))
    renderBar({ apiKey: '' })

    expect(screen.getByRole('status')).toHaveTextContent(
      `The saved session key expired at ${new Date(expiresAt).toLocaleString()}. Enter it again to continue.`
    )
  })
})
