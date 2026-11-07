import { beforeEach, describe, expect, it, vi } from 'vitest'
import { runAgent } from './llmAdapter'
import { recordAnalyticsRun } from './useAnalytics'
import { runBatch } from './batchRunner'

vi.mock('./llmAdapter', () => ({ runAgent: vi.fn() }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: vi.fn() }))

const agent = {
  id: 'writer',
  name: 'Writer',
  category: 'Content Writing',
  inputs: [{ id: 'topic', label: 'Topic' }],
}

function request(concurrency) {
  return {
    items: ['alpha', 'beta'],
    agent,
    fixedInputs: {},
    batchFieldId: 'topic',
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: 'key',
    systemPrompt: 'Write clearly',
    concurrency,
    onItemUpdate: vi.fn(),
    signal: null,
  }
}

describe('runBatch worker floor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    runAgent.mockResolvedValue({ content: 'ok', duration: 5 })
  })

  it('still runs every item when concurrency is zero', async () => {
    const options = request(0)
    await runBatch(options)

    expect(runAgent).toHaveBeenCalledTimes(2)
    const statuses = options.onItemUpdate.mock.calls.map((call) => call[1].status)
    expect(statuses.filter((status) => status === 'done')).toHaveLength(2)
  })

  it('normalizes negative concurrency instead of silently doing nothing', async () => {
    const options = request(-3)
    await runBatch(options)

    expect(runAgent).toHaveBeenCalledTimes(2)
    expect(options.onItemUpdate).toHaveBeenCalledWith(0, { status: 'running' })
    expect(options.onItemUpdate).toHaveBeenCalledWith(1, { status: 'running' })
  })
})
