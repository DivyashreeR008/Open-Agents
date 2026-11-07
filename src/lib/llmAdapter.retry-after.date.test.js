import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Retry-After date handling', () => {
  it('waits until the HTTP date and then retries the request', async () => {
    const waitingUntil = new Date(Date.now() + 2000).toUTCString()
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': waitingUntil }),
        json: async () => ({ error: { message: 'Rate limit reached' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: 'after wait' } }] }),
      })
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args)
    await vi.runAllTimersAsync()

    await expect(pending).resolves.toMatchObject({ content: 'after wait' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
