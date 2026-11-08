import { afterEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'

const args = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('one-shot abort handling', () => {
  it('passes the signal to fetch and rethrows an AbortError', async () => {
    const controller = new AbortController()
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(runAgent(args, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    })
    expect(fetchMock.mock.calls[0][1].signal).toBe(controller.signal)
  })

  it('does not retry an aborted request', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new DOMException('The operation was aborted.', 'AbortError'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(runAgent(args)).rejects.toMatchObject({ name: 'AbortError' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
