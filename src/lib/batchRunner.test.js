import { beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ runAgent: vi.fn() }))
const analytics = vi.hoisted(() => ({ recordAnalyticsRun: vi.fn() }))

vi.mock('./llmAdapter', () => ({ runAgent: provider.runAgent }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: analytics.recordAnalyticsRun }))

import { buildBatchUserMessage, parseCSV, parsePastedLines, runBatch } from './batchRunner'

const agent = {
  id: 'a1',
  name: 'Batch Agent',
  category: 'Engineering',
  inputs: [
    { id: 'topic', label: 'Topic' },
    { id: 'tone', label: 'Tone' },
    { id: 'keywords', label: 'Keywords' },
  ],
}

describe('parsePastedLines', () => {
  it('trims lines and drops blanks', () => {
    expect(parsePastedLines('  one  \n\n two \n   \nthree')).toEqual(['one', 'two', 'three'])
  })

  it('returns no items for empty or whitespace-only text', () => {
    expect(parsePastedLines('')).toEqual([])
    expect(parsePastedLines(' \n\t\n ')).toEqual([])
  })
})

describe('parseCSV', () => {
  it('keeps commas and escaped quotes inside quoted fields', () => {
    const { rows } = parseCSV('name,age\r\n"Doe, Jane",30\r\n"say ""hi""",40\r\n')

    expect(rows).toEqual([
      ['name', 'age'],
      ['Doe, Jane', '30'],
      ['say "hi"', '40'],
    ])
  })

  it('reads a final row without a trailing newline', () => {
    expect(parseCSV('one,two').rows).toEqual([['one', 'two']])
  })

  it('drops blank and whitespace-only rows', () => {
    expect(parseCSV('a,b\n\n   ,   \nc,d\n').rows).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
  })

  it('treats an empty document as no rows', () => {
    expect(parseCSV('')).toEqual({ rows: [] })
  })
})

describe('buildBatchUserMessage', () => {
  it('substitutes the batch field and formats array inputs', () => {
    expect(
      buildBatchUserMessage(
        agent,
        { tone: 'friendly', keywords: ['alpha', 'beta'] },
        'topic',
        '  release notes  '
      )
    ).toBe('Topic: release notes\n\nTone: friendly\n\nKeywords: alpha, beta')
  })

  it('omits blank and empty values and collapses surplus newlines', () => {
    expect(buildBatchUserMessage(agent, { tone: '   ', keywords: [] }, 'topic', 'launch')).toBe(
      'Topic: launch'
    )
    expect(buildBatchUserMessage(agent, {}, 'missing', '')).toBe('')
  })
})

describe('runBatch', () => {
  beforeEach(() => {
    provider.runAgent.mockReset()
    analytics.recordAnalyticsRun.mockReset()
  })

  it('runs every item with bounded concurrency and reports each state', async () => {
    const updates = []
    let active = 0
    let maxActive = 0

    provider.runAgent.mockImplementation(async ({ userMessage }) => {
      active += 1
      maxActive = Math.max(maxActive, active)
      await new Promise((resolve) => setTimeout(resolve, 5))
      active -= 1
      return { content: `out:${userMessage}`, duration: 12 }
    })

    await runBatch({
      items: ['first', 'second', 'third'],
      agent,
      fixedInputs: { tone: 'dry' },
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      systemPrompt: 'Write clearly.',
      concurrency: 2,
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(maxActive).toBe(2)
    expect(updates.filter((update) => update.status === 'running')).toHaveLength(3)
    expect(updates.filter((update) => update.status === 'done')).toHaveLength(3)
    expect(
      updates.filter((update) => update.status === 'done').map((update) => update.output)
    ).toEqual(
      expect.arrayContaining([
        'out:Topic: first\n\nTone: dry',
        'out:Topic: second\n\nTone: dry',
        'out:Topic: third\n\nTone: dry',
      ])
    )
    expect(analytics.recordAnalyticsRun).toHaveBeenCalledTimes(3)
    expect(analytics.recordAnalyticsRun).toHaveBeenCalledWith(
      expect.objectContaining({
        agentId: 'a1',
        agentName: 'Batch Agent',
        category: 'Engineering',
        provider: 'openai',
        model: 'gpt-test',
        duration: 12,
      })
    )
  })

  it('reports the provider message when one item fails', async () => {
    const updates = []
    provider.runAgent.mockRejectedValue(new Error('quota exhausted'))

    await runBatch({
      items: ['one'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      systemPrompt: 'sys',
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(updates).toEqual([
      { index: 0, status: 'running' },
      { index: 0, status: 'failed', error: 'quota exhausted' },
    ])
    expect(analytics.recordAnalyticsRun).not.toHaveBeenCalled()
  })

  it('falls back to a detail field and then to a generic failure message', async () => {
    const errors = []
    const onItemUpdate = (index, patch) => {
      if (patch.status === 'failed') errors.push(patch.error)
    }

    provider.runAgent.mockRejectedValueOnce({ detail: 'provider overloaded' })
    await runBatch({
      items: ['one'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      onItemUpdate,
    })

    provider.runAgent.mockRejectedValueOnce('not an error object')
    await runBatch({
      items: ['two'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      onItemUpdate,
    })

    expect(errors).toEqual(['provider overloaded', 'Failed to process this item.'])
  })

  it('stops before calling the provider when the signal is already aborted', async () => {
    const updates = []
    await runBatch({
      items: ['one'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      signal: { aborted: true },
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(updates).toEqual([])
    expect(provider.runAgent).not.toHaveBeenCalled()
  })

  it('discards a result that arrives after cancellation', async () => {
    const updates = []
    const signal = { aborted: false }
    provider.runAgent.mockImplementation(async () => {
      signal.aborted = true
      return { content: 'late', duration: 1 }
    })

    await runBatch({
      items: ['one'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      signal,
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(updates).toEqual([
      { index: 0, status: 'running' },
      { index: 0, status: 'cancelled' },
    ])
    expect(analytics.recordAnalyticsRun).not.toHaveBeenCalled()
  })

  it('does not report a failure caused by cancellation', async () => {
    const updates = []
    const signal = { aborted: false }
    provider.runAgent.mockImplementation(async () => {
      signal.aborted = true
      throw new Error('aborted')
    })

    await runBatch({
      items: ['one'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      signal,
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(updates).toEqual([
      { index: 0, status: 'running' },
      { index: 0, status: 'cancelled' },
    ])
  })

  it('leaves never-started rows waiting when cancellation stops the queue', async () => {
    const updates = []
    const signal = { aborted: false }
    provider.runAgent.mockImplementation(async ({ userMessage }) => {
      signal.aborted = true
      return { content: `late:${userMessage}`, duration: 1 }
    })

    await runBatch({
      items: ['one', 'two', 'three'],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      concurrency: 1,
      signal,
      onItemUpdate: (index, patch) => updates.push({ index, ...patch }),
    })

    expect(updates).toEqual([
      { index: 0, status: 'running' },
      { index: 0, status: 'cancelled' },
    ])
  })

  it('does nothing for an empty item list', async () => {
    await runBatch({
      items: [],
      agent,
      fixedInputs: {},
      batchFieldId: 'topic',
      provider: 'openai',
      model: 'gpt-test',
      apiKey: 'sk-test',
      onItemUpdate: vi.fn(),
    })

    expect(provider.runAgent).not.toHaveBeenCalled()
  })
})
