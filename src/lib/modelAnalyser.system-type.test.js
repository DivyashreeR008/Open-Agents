import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { analyseModels } from './modelAnalyser'

vi.mock('./llmAdapter', () => ({ streamAgent: vi.fn() }))

describe('model analyser system prompt typing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    streamAgent.mockResolvedValue({ content: 'ok', duration: 1 })
  })

  it('ignores a non-string system prompt instead of calling slice on it', async () => {
    await analyseModels({ name: 'Writer', systemPrompt: { text: 'secret' } }, 'key', 'openai')

    const message = streamAgent.mock.calls[0][0].userMessage
    expect(message).toContain('System prompt purpose: ')
    expect(message).not.toContain('secret')
  })
})
