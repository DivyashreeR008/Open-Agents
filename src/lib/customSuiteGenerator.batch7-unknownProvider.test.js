import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ streamAgent: vi.fn() }))
vi.mock('./llmAdapter', () => ({ streamAgent: mocks.streamAgent }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

import { generateCustomSuite } from './customSuiteGenerator'

describe('generateCustomSuite unknown provider', () => {
  it('falls back to the Gemini default model and strips a BOM and fences', async () => {
    mocks.streamAgent.mockResolvedValue({
      content: '\uFEFF```json\n{"title":"Plan","description":"Do it","agents":[]}\n```',
      duration: 12,
    })

    await expect(generateCustomSuite('ship a feature', 'key', 'unknown')).resolves.toEqual({
      title: 'Plan',
      description: 'Do it',
      agents: [],
    })
    expect(mocks.streamAgent).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'unknown', model: 'gemini-2.5-flash' })
    )
  })
})
