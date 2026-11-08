import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent, streamAgent } from './llmAdapter'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('provider and key validation', () => {
  it('rejects an unsupported one-shot provider before calling fetch', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      runAgent({
        provider: 'unknown',
        model: 'x',
        apiKey: 'key',
        systemPrompt: 'sys',
        userMessage: 'hi',
      })
    ).rejects.toThrow('Unsupported provider: unknown')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects an unsupported streaming provider before calling fetch', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      streamAgent({
        provider: 'unknown',
        model: 'x',
        apiKey: 'key',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow('Unsupported provider: unknown')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a missing or whitespace one-shot key', async () => {
    await expect(
      runAgent({
        provider: 'openai',
        model: 'gpt-4o',
        apiKey: '   ',
        systemPrompt: 'sys',
        userMessage: 'hi',
      })
    ).rejects.toThrow('Please provide an API key to run this agent.')
  })

  it('rejects a missing streaming key', async () => {
    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o',
        apiKey: '',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow('Please provide an API key to run this agent.')
  })
})
