import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ApiKeyBar from './ApiKeyBar'

const mocks = vi.hoisted(() => ({ fetchGeminiModels: vi.fn() }))

vi.mock('../lib/llmAdapter', async (importOriginal) => ({
  ...(await importOriginal()),
  fetchGeminiModels: mocks.fetchGeminiModels,
}))

beforeEach(() => {
  vi.useFakeTimers()
  localStorage.clear()
  sessionStorage.clear()
  mocks.fetchGeminiModels.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ApiKeyBar Gemini loading state', () => {
  it('disables the model selector and shows a loading placeholder', async () => {
    mocks.fetchGeminiModels.mockImplementation(() => new Promise(() => {}))

    render(
      <MemoryRouter>
        <ApiKeyBar
          provider="gemini"
          setProvider={vi.fn()}
          apiKey="gemini-key"
          setApiKey={vi.fn()}
          saveForSession={false}
          setSaveForSession={vi.fn()}
          agentProvider="gemini"
          model=""
          setModel={vi.fn()}
        />
      </MemoryRouter>
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    const modelTrigger = screen.getByRole('button', { name: 'Model' })
    expect(modelTrigger).toHaveTextContent('Loading models...')
    expect(modelTrigger).toBeDisabled()
  })
})
