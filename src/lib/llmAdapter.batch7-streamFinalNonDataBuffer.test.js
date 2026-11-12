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

describe('streamAgent final non-data buffer', () => {
  it('ignores a trailing comment after the terminator', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers(),
        body: body('data: [DONE]\n# trailing comment'),
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
    ).resolves.toMatchObject({ content: '' })
  })
})
