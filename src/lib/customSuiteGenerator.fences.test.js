import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { recordAnalyticsRun } from './useAnalytics'
import { generateCustomSuite } from './customSuiteGenerator'

vi.mock('./llmAdapter', () => ({ streamAgent: vi.fn() }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

const suite = {
  title: 'Release readiness',
  description: 'Checks a release before it ships.',
  agents: [{ id: 'code-reviewer', reason: 'Finds risky changes.' }],
}

describe('generateCustomSuite response framing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('accepts an uppercase JSON fence from a provider', async () => {
    streamAgent.mockResolvedValue({
      content: `\`\`\`JSON\n${JSON.stringify(suite)}\n\`\`\``,
      duration: 12,
    })

    await expect(generateCustomSuite('ship a release', 'key', 'openai')).resolves.toEqual(suite)
  })

  it('ignores a byte-order mark before the JSON document', async () => {
    streamAgent.mockResolvedValue({
      content: `\uFEFF${JSON.stringify(suite)}`,
      duration: 12,
    })

    await expect(generateCustomSuite('ship a release', 'key', 'openai')).resolves.toEqual(suite)
  })

  it('records the run after a framed response is parsed', async () => {
    streamAgent.mockResolvedValue({
      content: `\`\`\`json\n${JSON.stringify(suite)}\n\`\`\``,
      duration: 21,
    })

    await generateCustomSuite('ship a release', 'key', 'anthropic')

    expect(recordAnalyticsRun).toHaveBeenCalledWith(
      expect.objectContaining({ duration: 21, provider: 'anthropic' })
    )
  })
})
