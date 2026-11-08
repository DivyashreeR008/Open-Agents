import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildDraftAgent, getMissingDraftFields, loadDrafts, publishAgent } from './marketplace'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('draft field fallbacks', () => {
  it('treats a draft without flagged fields as having nothing missing', () => {
    expect(getMissingDraftFields({}, {})).toEqual([])
  })

  it('normalizes a draft whose config is not an object', () => {
    localStorage.setItem(
      'oa_marketplace_drafts',
      JSON.stringify([{ id: 'draft_1', config: 'not-an-object', pendingCredentialFields: [] }])
    )

    const drafts = loadDrafts()
    expect(drafts).toHaveLength(1)
    expect(drafts[0].config).toEqual({})
  })

  it('returns null when the agent catalogue is not an array', () => {
    const draft = { config: { baseAgentId: 'a1' }, name: 'Draft' }
    expect(buildDraftAgent(draft, null)).toBeNull()
  })

  it('keeps the base description when the draft has none', () => {
    const draft = {
      name: 'Draft',
      config: { baseAgentId: 'a1', provider: 'openai', systemPrompt: '' },
    }
    const agents = [
      {
        id: 'a1',
        name: 'Base',
        description: 'Base description',
        provider: 'anthropic',
        systemPrompt: 'Base prompt',
      },
    ]

    const agent = buildDraftAgent(draft, agents)
    expect(agent.description).toBe('Base description')
    expect(agent.provider).toBe('openai')
    expect(agent.systemPrompt).toBe('Base prompt')
  })

  it('imports a listing without configuration into an empty draft config', () => {
    const listing = publishAgent({ name: 'No config', config: {} })
    const { importAgent } = require('./marketplace')
    const draft = importAgent(listing.id)
    expect(draft.config).toEqual({})
    expect(draft.readyToRun).toBe(true)
  })
})
