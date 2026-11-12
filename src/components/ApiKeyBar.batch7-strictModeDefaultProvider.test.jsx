import { StrictMode } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'
import { MODELS } from '../lib/resolveAgentModel'
import { saveGlobalKeys } from '../lib/globalKeys'

const mocks = vi.hoisted(() => ({ fetchGeminiModels: vi.fn() }))

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: mocks.fetchGeminiModels,
}))

function Harness({ onProviderChange }) {
  return (
    <MemoryRouter>
      <ApiKeyBar
        provider="openai"
        setProvider={onProviderChange}
        apiKey=""
        setApiKey={() => {}}
        saveForSession={false}
        setSaveForSession={() => {}}
        agentProvider="any"
        model={MODELS.openai[0].value}
        setModel={() => {}}
      />
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  saveGlobalKeys({ anthropic: 'sk-ant', defaultProvider: 'anthropic' })
})

describe('ApiKeyBar default provider in StrictMode', () => {
  it('applies the saved default provider only once across repeated effects', async () => {
    const onProviderChange = vi.fn()
    render(
      <StrictMode>
        <Harness onProviderChange={onProviderChange} />
      </StrictMode>
    )

    await waitFor(() => expect(onProviderChange).toHaveBeenCalledWith('anthropic'))
    expect(onProviderChange).toHaveBeenCalledTimes(1)
  })
})
