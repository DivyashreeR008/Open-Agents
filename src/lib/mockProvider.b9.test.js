import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it } from 'vitest'
import { fetchGeminiModels, runAgent, streamAgent } from './llmAdapter'
import {
  MOCK_API_KEY,
  MOCK_CHAT_MODEL,
  MOCK_SCENARIOS,
  createMockFetch,
  installMockFetch,
} from './mockProvider'

const originalFetch = globalThis.fetch
const providers = ['openai', 'anthropic', 'gemini', 'openrouter']
const testingGuide = readFileSync('docs/TESTING.md', 'utf8')

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('deterministic mock provider', () => {
  it.each(providers)('runs %s agents without a live key or network', async (provider) => {
    const mockFetch = createMockFetch()
    globalThis.fetch = mockFetch

    const result = await runAgent({
      provider,
      model: MOCK_CHAT_MODEL,
      apiKey: MOCK_API_KEY,
      systemPrompt: 'Answer briefly.',
      userMessage: 'Hello offline world',
    })

    expect(result.content).toContain('Hello offline world')
    expect(result.tokens).toBeGreaterThan(0)
    expect(result.duration).toBeGreaterThanOrEqual(0)
    expect(mockFetch.calls).toHaveLength(1)
    expect(mockFetch.calls[0]).toMatchObject({ provider, method: 'POST', streaming: false })
  })

  it.each(providers)('streams %s responses through the real stream parser', async (provider) => {
    const mockFetch = createMockFetch()
    globalThis.fetch = mockFetch
    const chunks = []

    const result = await streamAgent({
      provider,
      model: MOCK_CHAT_MODEL,
      apiKey: MOCK_API_KEY,
      systemPrompt: '',
      userMessage: 'Stream this offline',
      onChunk: (chunk) => chunks.push(chunk),
    })

    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.join('')).toBe(result.content)
    expect(result.content).toContain('Stream this offline')
    expect(mockFetch.calls[0].streaming).toBe(true)
  })

  it('uses a caller-supplied response and records requests without auth headers', async () => {
    const mockFetch = createMockFetch({ response: 'Fixed fixture output' })
    globalThis.fetch = mockFetch

    const result = await runAgent({
      provider: 'openai',
      model: 'fixture',
      apiKey: MOCK_API_KEY,
      systemPrompt: '',
      userMessage: 'ignored',
    })

    expect(result.content).toBe('Fixed fixture output')
    expect(mockFetch.calls[0].url).toBe('https://api.openai.com/v1/chat/completions')
    expect(JSON.stringify(mockFetch.calls[0])).not.toContain(MOCK_API_KEY)
  })

  it('lists a ready-to-use Gemini model without credentials', async () => {
    const mockFetch = createMockFetch()
    globalThis.fetch = mockFetch

    const models = await fetchGeminiModels(MOCK_API_KEY)

    expect(models).toEqual([{ value: MOCK_CHAT_MODEL, label: 'Mock Chat' }])
    expect(mockFetch.calls[0]).toMatchObject({ provider: 'gemini', method: 'GET' })
  })
})

describe('mock provider failure scenarios', () => {
  it.each([
    ['invalid-key', 'invalid_api_key'],
    ['quota', 'quota_exhausted'],
  ])('surfaces the %s response', async (scenario, type) => {
    globalThis.fetch = createMockFetch({ scenario })

    await expect(
      runAgent({
        provider: 'openai',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'fail',
      })
    ).rejects.toMatchObject({ type })
  })

  it('surfaces a server failure with the provider detail', async () => {
    globalThis.fetch = createMockFetch({ scenario: 'server' })

    await expect(
      runAgent({
        provider: 'openai',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'fail',
      })
    ).rejects.toThrow(/temporarily unavailable.*Mock server failure/s)
  })

  it('keeps the real retry policy for rate limits', async () => {
    const mockFetch = createMockFetch({ scenario: 'rate-limit' })
    globalThis.fetch = mockFetch

    await expect(
      runAgent({
        provider: 'openai',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'retry me',
      })
    ).rejects.toMatchObject({ type: 'rate_limited' })

    expect(mockFetch.calls).toHaveLength(3)
  })

  it('reports an unreachable mock network like a real connection failure', async () => {
    globalThis.fetch = createMockFetch({ scenario: 'network' })

    await expect(
      runAgent({
        provider: 'anthropic',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'offline',
      })
    ).rejects.toThrow("Couldn't reach the API")
  })

  it('marks a cut-off stream as incomplete and keeps partial content', async () => {
    globalThis.fetch = createMockFetch({ scenario: 'stream-cutoff' })

    await expect(
      streamAgent({
        provider: 'openai',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'truncate this',
        onChunk: () => {},
      })
    ).rejects.toMatchObject({ type: 'stream_error' })

    try {
      await streamAgent({
        provider: 'openai',
        model: MOCK_CHAT_MODEL,
        apiKey: MOCK_API_KEY,
        systemPrompt: '',
        userMessage: 'truncate this',
        onChunk: () => {},
      })
    } catch (error) {
      expect(error.partialContent.length).toBeGreaterThan(0)
      expect(error.partialContent).toContain('Mock provide')
    }
  })

  it('supports aborting a request before it starts', async () => {
    const mockFetch = createMockFetch()
    globalThis.fetch = mockFetch
    const controller = new AbortController()
    controller.abort()

    const result = await streamAgent({
      provider: 'openai',
      model: MOCK_CHAT_MODEL,
      apiKey: MOCK_API_KEY,
      systemPrompt: '',
      userMessage: 'never sent',
      onChunk: () => {},
      signal: controller.signal,
    })

    expect(result).toEqual({ content: '', duration: expect.any(Number) })
  })

  it('rejects unknown scenarios instead of silently succeeding', () => {
    expect(() => createMockFetch({ scenario: 'not-a-scenario' })).toThrow(/Unknown mock provider/)
    expect(MOCK_SCENARIOS).toContain('stream-cutoff')
  })
})

describe('installMockFetch', () => {
  it('restores the previous fetch function', async () => {
    const previous = () => Promise.resolve(new Response('previous'))
    globalThis.fetch = previous
    const installed = installMockFetch()

    expect(globalThis.fetch).not.toBe(previous)
    expect(
      (
        await globalThis.fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] }),
        })
      ).status
    ).toBe(200)

    installed.restore()
    expect(globalThis.fetch).toBe(previous)
    expect(installed.calls.length).toBe(1)
  })
})

describe('offline testing guide', () => {
  it('documents the mock, its scenarios, and the restore requirement', () => {
    expect(testingGuide).toContain('src/lib/mockProvider.js')
    expect(testingGuide).toContain('installMockFetch')
    expect(testingGuide).toContain('mock.restore()')
    for (const scenario of MOCK_SCENARIOS) {
      expect(testingGuide).toContain(`\`${scenario}\``)
    }
  })

  it('says provider tests must not require live credentials', () => {
    expect(testingGuide).toContain('Tests must not call live providers.')
    expect(testingGuide).toContain('MOCK_API_KEY')
    expect(testingGuide).toContain('never imported by application code')
  })
})
