import { beforeEach, describe, expect, it, vi } from 'vitest'
import { streamAgent } from './llmAdapter'
import { generateCustomSuite } from './customSuiteGenerator'

vi.mock('./llmAdapter', () => ({ streamAgent: vi.fn() }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('custom suite output validation', () => {
  it.each([
    ['an array', '[]'],
    ['a document without agents', '{"title":"Launch","description":"Ship it"}'],
    [
      'a document with an empty agent list',
      '{"title":"Launch","description":"Ship it","agents":[]}',
    ],
    [
      'a document with malformed agents',
      '{"title":"Launch","description":"Ship it","agents":[null,{"id":""}]}',
    ],
  ])('rejects %s instead of returning it to the page', async (_label, content) => {
    streamAgent.mockResolvedValue({ content, duration: 4 })

    await expect(generateCustomSuite('ship an update', 'key', 'openai')).rejects.toThrow(
      'The generated suite was not usable. Please try again.'
    )
  })

  it('normalizes valid agents and drops blank ids or reasons safely', async () => {
    streamAgent.mockResolvedValue({
      content: JSON.stringify({
        title: '  Launch plan  ',
        description: '  Ship a focused update.  ',
        agents: [
          { id: ' code-reviewer ', reason: ' Reviews the change. ' },
          { id: '', reason: 'No id' },
          { id: 'unit-test-generator' },
        ],
      }),
      duration: 8,
    })

    await expect(generateCustomSuite('ship an update', 'key', 'openrouter')).resolves.toEqual({
      title: 'Launch plan',
      description: 'Ship a focused update.',
      agents: [
        { id: 'code-reviewer', reason: 'Reviews the change.' },
        { id: 'unit-test-generator', reason: '' },
      ],
    })
    expect(streamAgent.mock.calls[0][0].model).toBe('openai/gpt-4o-mini')
  })
})
