import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ApiKeyBar from './ApiKeyBar'

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: vi.fn(),
}))

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

function renderBar(provider) {
  return render(
    <MemoryRouter>
      <ApiKeyBar
        provider={provider}
        setProvider={vi.fn()}
        apiKey=""
        setApiKey={vi.fn()}
        saveForSession={false}
        setSaveForSession={vi.fn()}
        agentProvider={provider}
        model=""
        setModel={vi.fn()}
      />
    </MemoryRouter>
  )
}

describe('ApiKeyBar unknown provider models', () => {
  it('shows an empty model list instead of crashing for an unknown provider', () => {
    renderBar('mystery')

    const modelTrigger = screen.getByRole('button', { name: 'Model' })
    expect(modelTrigger).toHaveTextContent('Select Model')
  })
})
