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
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('retry sleep abort handling', () => {
  it('rejects an in-flight retry wait as soon as the caller aborts', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ 'retry-after': '2' }),
      json: async () => ({ error: { message: 'slow down' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const pending = runAgent(args, { signal: controller.signal })
    for (let i = 0; i < 20 && vi.getTimerCount() === 0; i += 1) {
      await Promise.resolve()
    }
    expect(vi.getTimerCount()).toBe(1)

    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
