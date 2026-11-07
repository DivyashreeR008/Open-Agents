import { describe, expect, it } from 'vitest'
import { runAgent, streamAgent } from './llmAdapter'

const base = {
  provider: 'unknown-provider',
  model: 'x',
  apiKey: 'sk-test',
  systemPrompt: 'sys',
  userMessage: 'hi',
}

describe('provider and key validation', () => {
  it('rejects an unknown provider for both one-shot and streaming calls', async () => {
    await expect(runAgent(base)).rejects.toThrow('Unsupported provider: unknown-provider')
    await expect(streamAgent({ ...base, onChunk: () => {} })).rejects.toThrow(
      'Unsupported provider: unknown-provider'
    )
  })

  it('rejects a blank key for both call styles before any request starts', async () => {
    const provider = { ...base, provider: 'openai', apiKey: '   ' }
    await expect(runAgent(provider)).rejects.toThrow('Please provide an API key to run this agent.')
    await expect(streamAgent({ ...provider, onChunk: () => {} })).rejects.toThrow(
      'Please provide an API key to run this agent.'
    )
  })
})
