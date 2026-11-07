// @vitest-environment jsdom
import { webcrypto } from 'node:crypto'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const keyStoreState = vi.hoisted(() => ({ key: null }))
const provider = vi.hoisted(() => ({ runAgent: vi.fn() }))
const analytics = vi.hoisted(() => ({ recordAnalyticsRun: vi.fn() }))

vi.mock('./automationKeyStore', () => ({
  CredentialProtectionError: class extends Error {},
  getOrCreateDeviceKey: async () => keyStoreState.key,
}))
vi.mock('./llmAdapter', () => ({ runAgent: provider.runAgent }))
vi.mock('./useAnalytics', () => ({ recordAnalyticsRun: analytics.recordAnalyticsRun }))
vi.mock('./supabase', () => ({ supabase: {}, isSupabaseConfigured: false }))

import { createAutomation, runAutomationNow } from './automationsService'

const NOW = Date.UTC(2026, 10, 7, 9, 0, 0)

describe('automation run request payload', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', webcrypto)
  })

  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('oa_automations_v2', '[]')
    localStorage.setItem('oa_automation_runs_v2', '[]')
    keyStoreState.key = await webcrypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    provider.runAgent.mockReset()
    analytics.recordAnalyticsRun.mockReset()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('joins arrays, drops empty fields, and estimates tokens when the provider omits them', async () => {
    provider.runAgent.mockResolvedValue({ content: 'ABCDEFGH', duration: 17 })
    const job = await createAutomation({
      name: 'Payload check',
      agentId: '5',
      agentName: 'Blog Post SEO Optimizer',
      category: 'Marketing',
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-payload',
      inputs: {
        topics: ['alpha', 'beta'],
        notes: 'hello',
        empty: '',
        none: [],
        disabled: false,
        zero: 0,
      },
    })

    const run = await runAutomationNow(job.id)

    const userMessage = 'topics: alpha, beta\n\nnotes: hello'
    expect(provider.runAgent).toHaveBeenCalledWith({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-payload',
      systemPrompt: 'You are an intelligent AI agent executing a scheduled task.',
      userMessage,
    })
    expect(run.tokens).toBe(Math.round((8 + userMessage.length) / 4))
    expect(run.output).toBe('ABCDEFGH')
    expect(analytics.recordAnalyticsRun).toHaveBeenCalledWith({
      agentId: '5',
      agentName: 'Blog Post SEO Optimizer',
      category: 'Marketing',
      provider: 'openai',
      model: 'gpt-4o-mini',
      duration: 17,
    })
  })

  it('uses a saved system prompt and the provider token count when present', async () => {
    provider.runAgent.mockResolvedValue({ content: 'report', tokens: 321, duration: 4 })
    const job = await createAutomation({
      name: 'Custom prompt',
      agentId: '8',
      agentName: 'Agent Eight',
      apiKey: 'sk-custom',
      systemPrompt: 'Review only the changed lines.',
      inputs: { diff: '+line' },
    })

    const run = await runAutomationNow(job.id)

    expect(provider.runAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        systemPrompt: 'Review only the changed lines.',
        userMessage: 'diff: +line',
      })
    )
    expect(run.tokens).toBe(321)
  })

  it('sends a generic instruction when no inputs are saved', async () => {
    provider.runAgent.mockResolvedValue({ content: 'ok', tokens: 1, duration: 1 })
    const job = await createAutomation({
      name: 'No inputs',
      agentId: '3',
      agentName: 'Agent Three',
      apiKey: 'sk-empty',
      inputs: {},
    })

    await runAutomationNow(job.id)

    expect(provider.runAgent).toHaveBeenCalledWith(
      expect.objectContaining({ userMessage: 'Execute scheduled agent run.' })
    )
  })
})
