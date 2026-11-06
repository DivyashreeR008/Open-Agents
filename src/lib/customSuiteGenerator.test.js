import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { recordAnalyticsRun } from './useAnalytics'
import { generateCustomSuite } from './customSuiteGenerator'
import { suites } from '../suites/suitesData'

vi.mock('./llmAdapter', () => ({
  streamAgent: vi.fn(),
}))

vi.mock('./useAnalytics', () => ({
  recordAnalyticsRun: vi.fn(),
}))

const suiteResponse = {
  title: 'Launch checklist',
  description: 'A focused set of agents for shipping a small product update.',
  agents: [
    { id: 'code-reviewer', reason: 'Checks the changed code.' },
    { id: 'unit-test-generator', reason: 'Adds regression coverage.' },
  ],
}

describe('generateCustomSuite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    streamAgent.mockResolvedValue({
      content: JSON.stringify(suiteResponse),
      duration: 87,
    })
  })

  it('parses plain JSON returned by the model', async () => {
    await expect(generateCustomSuite('ship a small update', 'key', 'openai')).resolves.toEqual(
      suiteResponse
    )
  })

  it('parses JSON wrapped in a fenced code block', async () => {
    streamAgent.mockResolvedValue({
      content: `\`\`\`json\n${JSON.stringify(suiteResponse)}\n\`\`\``,
      duration: 87,
    })

    await expect(generateCustomSuite('ship a small update', 'key', 'openai')).resolves.toEqual(
      suiteResponse
    )
  })

  it('strips fences even when they are surrounded by whitespace', async () => {
    streamAgent.mockResolvedValue({
      content: `  \`\`\`\n${JSON.stringify(suiteResponse)}\n\`\`\`  `,
      duration: 87,
    })

    await expect(generateCustomSuite('ship a small update', 'key', 'gemini')).resolves.toEqual(
      suiteResponse
    )
  })

  it.each([
    ['openai', 'gpt-4o-mini'],
    ['anthropic', 'claude-3-5-haiku-20241022'],
    ['gemini', 'gemini-2.5-flash'],
  ])('uses the documented default model for %s', async (provider, model) => {
    await generateCustomSuite('ship a small update', 'secret-key', provider)

    expect(streamAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        provider,
        apiKey: 'secret-key',
        model,
      })
    )
  })

  it('falls back to the Gemini default for an unknown provider', async () => {
    await generateCustomSuite('ship a small update', 'key', 'unknown-provider')

    expect(streamAgent.mock.calls[0][0].model).toBe('gemini-2.5-flash')
  })

  it('records the generated run with its provider, model, and duration', async () => {
    await generateCustomSuite('ship a small update', 'key', 'anthropic')

    expect(recordAnalyticsRun).toHaveBeenCalledWith({
      agentId: 'custom-suite-generator',
      agentName: 'Custom Suite Generator',
      category: 'Suites',
      provider: 'anthropic',
      model: 'claude-3-5-haiku-20241022',
      duration: 87,
    })
  })

  it('rejects malformed model output instead of returning a partial suite', async () => {
    streamAgent.mockResolvedValue({ content: 'Here is a suite for you.', duration: 19 })

    await expect(generateCustomSuite('ship a small update', 'key', 'openai')).rejects.toThrow(
      SyntaxError
    )
  })

  it('propagates a provider failure without recording a completed run', async () => {
    streamAgent.mockRejectedValue(new Error('The provider rejected the key'))

    await expect(generateCustomSuite('ship a small update', 'key', 'openai')).rejects.toThrow(
      'The provider rejected the key'
    )
    expect(recordAnalyticsRun).not.toHaveBeenCalled()
  })

  it('uses the catalogue in the prompt without mutating it', async () => {
    const before = JSON.parse(JSON.stringify(suites))

    await generateCustomSuite('ship a small update', 'key', 'openai')

    const request = streamAgent.mock.calls[0][0]
    expect(request.systemPrompt).toContain('Developer Suite')
    expect(request.systemPrompt).toContain('code-reviewer')
    expect(request.userMessage).toBe('My goal is: ship a small update')
    expect(suites).toEqual(before)
  })
})
