import { describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ streamAgent: vi.fn() }))
vi.mock('./llmAdapter', () => ({ streamAgent: mocks.streamAgent }))

import { analyseModels } from './modelAnalyser'

describe('analyseModels unknown provider and empty agent', () => {
  it('uses the Gemini default model and empty agent context', async () => {
    mocks.streamAgent.mockResolvedValue({ content: '## Model Recommendations' })

    await expect(analyseModels(null, 'key', 'unknown')).resolves.toBe('## Model Recommendations')
    expect(mocks.streamAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'unknown',
        model: 'gemini-2.5-flash',
        userMessage: expect.stringContaining('Agent name: '),
      })
    )
  })
})
