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

describe('ApiKeyBar Gemini empty model list', () => {
  it('keeps the existing model when the provider returns no models', async () => {
    mocks.fetchGeminiModels.mockResolvedValue([])
    const setModel = vi.fn()

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
          setModel={setModel}
        />
      </MemoryRouter>
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    expect(mocks.fetchGeminiModels).toHaveBeenCalledWith('gemini-key')
    expect(setModel).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Model' })).toHaveTextContent('Select Model')
  })
})
