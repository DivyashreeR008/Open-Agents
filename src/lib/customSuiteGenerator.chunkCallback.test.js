import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { recordAnalyticsRun } from './useAnalytics'
import { generateCustomSuite } from './customSuiteGenerator'

vi.mock('./llmAdapter', () => ({ streamAgent: vi.fn() }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

const suiteResponse = {
  title: 'Tiny launch suite',
  description: 'A focused set of agents.',
  agents: [{ id: 'code-reviewer', reason: 'Checks the change.' }],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('generateCustomSuite streaming callback', () => {
  it('tolerates a provider that emits chunks before returning the final content', async () => {
    streamAgent.mockImplementation(async ({ onChunk }) => {
      onChunk('partial response')
      return { content: JSON.stringify(suiteResponse), duration: 42 }
    })

    await expect(generateCustomSuite('ship a small update', 'key', 'openai')).resolves.toEqual(
      suiteResponse
    )
    expect(recordAnalyticsRun).toHaveBeenCalledTimes(1)
  })
})
