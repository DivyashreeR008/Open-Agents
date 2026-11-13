import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { analyseModels } from './modelAnalyser'

vi.mock('./llmAdapter', () => ({ streamAgent: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
  streamAgent.mockResolvedValue({ content: 'analysis', duration: 3 })
})

describe('model analysis provider defaults', () => {
  it('uses an OpenRouter model id when OpenRouter is the selected provider', async () => {
    await analyseModels({ name: 'Reviewer' }, 'key', 'openrouter')

    expect(streamAgent.mock.calls[0][0]).toMatchObject({
      provider: 'openrouter',
      model: 'openai/gpt-4o-mini',
    })
  })
})
