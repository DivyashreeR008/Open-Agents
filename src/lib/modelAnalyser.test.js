import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { analyseModels } from './modelAnalyser'

vi.mock('./llmAdapter', () => ({
  streamAgent: vi.fn(),
}))

const agent = {
  name: 'API reviewer',
  description: 'Reviews API changes for compatibility risks.',
  systemPrompt: 'Review the supplied API contract and report breaking changes.',
}

describe('analyseModels', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    streamAgent.mockResolvedValue({ content: '## Model Recommendations', duration: 41 })
  })

  it.each([
    ['openai', 'gpt-4o-mini'],
    ['anthropic', 'claude-3-5-haiku-20241022'],
    ['gemini', 'gemini-2.5-flash'],
  ])('uses the documented default model for %s', async (provider, model) => {
    await analyseModels(agent, 'provider-key', provider)

    expect(streamAgent).toHaveBeenCalledTimes(1)
    expect(streamAgent.mock.calls[0][0]).toMatchObject({
      provider,
      apiKey: 'provider-key',
      model,
    })
  })

  it('falls back to the Gemini default for an unknown provider', async () => {
    await analyseModels(agent, 'key', 'mistral')

    expect(streamAgent.mock.calls[0][0].model).toBe('gemini-2.5-flash')
  })

  it('truncates a long system prompt to 300 characters', async () => {
    await analyseModels({ ...agent, systemPrompt: 'x'.repeat(400) }, 'key', 'openai')

    const message = streamAgent.mock.calls[0][0].userMessage
    expect(message).toContain('x'.repeat(300))
    expect(message).not.toMatch(/x{301}/)
  })

  it('assembles a prompt when optional agent fields are missing', async () => {
    await expect(analyseModels({}, 'key', 'openai')).resolves.toBe('## Model Recommendations')

    const message = streamAgent.mock.calls[0][0].userMessage
    expect(message).toContain('Agent name: ')
    expect(message).toContain('Description: ')
    expect(message).toContain('System prompt purpose: ')
  })

  it('handles a missing agent object without throwing during prompt assembly', async () => {
    await expect(analyseModels(undefined, 'key', 'gemini')).resolves.toBe(
      '## Model Recommendations'
    )
  })

  it('returns the streamed content and provides a chunk callback', async () => {
    await expect(analyseModels(agent, 'key', 'openai')).resolves.toBe('## Model Recommendations')

    const options = streamAgent.mock.calls[0][0]
    expect(options.onChunk).toEqual(expect.any(Function))
    expect(() => options.onChunk('partial')).not.toThrow()
  })

  it('includes the supported model table in the system prompt', async () => {
    await analyseModels(agent, 'key', 'anthropic')

    const systemPrompt = streamAgent.mock.calls[0][0].systemPrompt
    expect(systemPrompt).toContain('## Model Recommendations')
    expect(systemPrompt).toContain('Available models:')
    expect(systemPrompt).toContain('Claude 3.5 Sonnet')
  })
})
