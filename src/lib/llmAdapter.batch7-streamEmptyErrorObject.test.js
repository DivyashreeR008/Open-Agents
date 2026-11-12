import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'

function body(text) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    },
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('streamAgent empty error object', () => {
  it('uses the generic provider stream error message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        body: body('data: {"error":{}}\n'),
      })
    )

    await expect(
      streamAgent({
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: 'sk-test',
        systemPrompt: 'sys',
        userMessage: 'hi',
        onChunk: () => {},
      })
    ).rejects.toThrow('The provider reported an error while streaming.')
  })
})
