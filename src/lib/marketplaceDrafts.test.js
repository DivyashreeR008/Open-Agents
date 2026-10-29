import { describe, it, expect, beforeEach } from 'vitest'
import {
  publishAgent,
  importAgent,
  loadDrafts,
  getDraft,
  removeDraft,
  getImportedListingIds,
  getMissingDraftFields,
  buildDraftAgent,
} from './marketplace'

const baseAgents = [
  { id: 'summarizer', name: 'Summarizer', provider: 'openai', systemPrompt: 'base prompt', inputs: [] },
]

function publish(config = {}) {
  return publishAgent({
    name: 'Pack',
    description: 'does things',
    tags: ['a'],
    category: 'Research',
    config: { baseAgentId: 'summarizer', provider: 'anthropic', systemPrompt: 'custom prompt', ...config },
  })
}

describe('imported drafts', () => {
  beforeEach(() => localStorage.clear())

  it('lists a draft after import', () => {
    const listing = publish()
    const draft = importAgent(listing.id)
    expect(loadDrafts().map((d) => d.id)).toEqual([draft.id])
    expect(getDraft(draft.id).name).toBe('Pack (imported)')
  })

  it('returns null for a draft that does not exist', () => {
    expect(getDraft('nope')).toBeNull()
  })

  it('removes a draft and keeps the listing', () => {
    const listing = publish()
    const draft = importAgent(listing.id)
    expect(removeDraft(draft.id)).toBe(true)
    expect(loadDrafts()).toEqual([])
    expect(removeDraft(draft.id)).toBe(false)
    expect(JSON.parse(localStorage.getItem('oa_marketplace_listings'))).toHaveLength(1)
  })

  it('tracks which listings are imported and clears it on remove', () => {
    const listing = publish()
    expect(getImportedListingIds().has(listing.id)).toBe(false)
    const draft = importAgent(listing.id)
    expect(getImportedListingIds().has(listing.id)).toBe(true)
    removeDraft(draft.id)
    expect(getImportedListingIds().has(listing.id)).toBe(false)
  })

  it('skips malformed stored drafts instead of throwing', () => {
    localStorage.setItem(
      'oa_marketplace_drafts',
      JSON.stringify([null, 'x', 5, { name: 'no id' }, { id: 'ok', config: 'bad', pendingCredentialFields: 'bad' }])
    )
    const drafts = loadDrafts()
    expect(drafts).toHaveLength(1)
    expect(drafts[0].id).toBe('ok')
    expect(drafts[0].config).toEqual({})
    expect(drafts[0].pendingCredentialFields).toEqual([])
    expect(drafts[0].readyToRun).toBe(true)
  })

  it('returns an empty list when the drafts store is not an array', () => {
    localStorage.setItem('oa_marketplace_drafts', JSON.stringify({ id: 'x' }))
    expect(loadDrafts()).toEqual([])
    localStorage.setItem('oa_marketplace_drafts', '{not json')
    expect(loadDrafts()).toEqual([])
  })

  it('can import after the drafts store was corrupted', () => {
    const listing = publish()
    localStorage.setItem('oa_marketplace_drafts', JSON.stringify({ broken: true }))
    const draft = importAgent(listing.id)
    expect(loadDrafts().map((d) => d.id)).toEqual([draft.id])
  })
})

function storageDump() {
  return Array.from({ length: localStorage.length }, (_, i) => {
    const key = localStorage.key(i)
    return `${key}=${localStorage.getItem(key)}`
  }).join('\n')
}

describe('getMissingDraftFields', () => {
  beforeEach(() => localStorage.clear())

  const draft = { pendingCredentialFields: ['apiKey', 'auth.token'] }

  it('reports every flagged field when nothing was entered', () => {
    expect(getMissingDraftFields(draft)).toEqual(['apiKey', 'auth.token'])
  })

  it('treats blanks and untouched placeholders as missing', () => {
    expect(
      getMissingDraftFields(draft, { apiKey: '   ', 'auth.token': 'YOUR_AUTH_TOKEN_HERE' })
    ).toEqual(['apiKey', 'auth.token'])
  })

  it('is empty once all fields have real values', () => {
    expect(getMissingDraftFields(draft, { apiKey: 'a', 'auth.token': 'b' })).toEqual([])
  })

  it('never writes entered values to storage', () => {
    getMissingDraftFields(draft, { apiKey: 'sk-secret-value', 'auth.token': 'tok' })
    expect(storageDump()).not.toContain('sk-secret-value')
    expect(localStorage.getItem('oa_marketplace_drafts')).toBeNull()
  })
})

describe('buildDraftAgent', () => {
  it('layers the draft over its base agent', () => {
    const listing = publish()
    const draft = importAgent(listing.id)
    const agent = buildDraftAgent(draft, baseAgents)
    expect(agent.id).toBe('summarizer')
    expect(agent.name).toBe('Pack (imported)')
    expect(agent.provider).toBe('anthropic')
    expect(agent.systemPrompt).toBe('custom prompt')
  })

  it('falls back to the base agent for an unknown provider or empty prompt', () => {
    const draft = importAgent(publish({ provider: 'evil', systemPrompt: '  ' }).id)
    const agent = buildDraftAgent(draft, baseAgents)
    expect(agent.provider).toBe('openai')
    expect(agent.systemPrompt).toBe('base prompt')
  })

  it('returns null when the base agent is gone', () => {
    const draft = importAgent(publish({ baseAgentId: 'missing' }).id)
    expect(buildDraftAgent(draft, baseAgents)).toBeNull()
    expect(buildDraftAgent(draft, [])).toBeNull()
  })
})
