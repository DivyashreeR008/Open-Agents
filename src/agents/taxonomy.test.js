import fs from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CATEGORIES, PROVIDERS, PROVIDER_VALUES } from './categories'
import { MARKETPLACE_CATEGORIES, normalizeListing, publishAgent } from '../lib/marketplace'
import { MODELS } from '../lib/resolveAgentModel'

const read = (file) => fs.readFileSync(path.join(process.cwd(), file), 'utf8')

function dropdownOptions(source, id) {
  const idIndex = source.indexOf(`id: ${id}`)
  if (idIndex === -1) return []
  const optionsIndex = source.indexOf('options:', idIndex)
  if (optionsIndex === -1) return []
  const validationsIndex = source.indexOf('validations:', optionsIndex)
  const block = source.slice(optionsIndex, validationsIndex === -1 ? undefined : validationsIndex)
  return [...block.matchAll(/^\s{8}- (.+)$/gm)].map((match) => match[1].trim())
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('catalog taxonomy', () => {
  it('keeps category and provider values unique and non-empty', () => {
    expect(new Set(CATEGORIES).size).toBe(CATEGORIES.length)
    expect(CATEGORIES.every((category) => typeof category === 'string' && category)).toBe(true)
    expect(new Set(PROVIDER_VALUES).size).toBe(PROVIDER_VALUES.length)
    expect(PROVIDERS.every((provider) => provider.value && provider.label)).toBe(true)
  })

  it('covers every provider in the model catalog', () => {
    expect(Object.keys(MODELS).sort()).toEqual([...PROVIDER_VALUES].sort())
  })

  it('keeps the new-agent template aligned with the canonical lists', () => {
    const template = read('.github/ISSUE_TEMPLATE/new_agent.yml')

    expect(dropdownOptions(template, 'category')).toEqual(CATEGORIES)
    expect(dropdownOptions(template, 'provider')).toEqual([
      ...PROVIDERS.map((provider) => provider.label),
      'Any',
    ])
  })

  it('keeps the bug template provider options aligned with the runtime', () => {
    const template = read('.github/ISSUE_TEMPLATE/bug_report.yml')

    expect(dropdownOptions(template, 'provider')).toEqual([
      ...PROVIDERS.map((provider) => provider.label),
      'Not applicable',
    ])
  })

  it('keeps the proposal template on the same taxonomy', () => {
    const proposal = read('agent_proposal.md')
    const categoryList = CATEGORIES.map((category) => `\`${category}\``).join(', ')

    expect(proposal).toContain(`_Pick one canonical category: ${categoryList}._`)
    expect(proposal).toContain(`_(${PROVIDER_VALUES.join(' / ')} / any)_`)
  })

  it('lists existing product areas in both feedback templates', () => {
    const featureAreas = dropdownOptions(read('.github/ISSUE_TEMPLATE/feature_request.yml'), 'area')
    const feedbackAreas = dropdownOptions(
      read('.github/ISSUE_TEMPLATE/general_feedback.yml'),
      'area'
    )

    expect(feedbackAreas).toEqual(featureAreas)
    for (const area of [
      'Collections',
      'Workflows',
      'Automations',
      'Marketplace',
      'Analytics',
      'Settings and API Keys',
    ]) {
      expect(featureAreas).toContain(area)
    }
  })

  it('uses the canonical marketplace categories and maps legacy names', () => {
    expect(MARKETPLACE_CATEGORIES).toEqual(CATEGORIES)
    expect(normalizeListing({ id: 'legacy-data', category: 'Data Processing' }).category).toBe(
      'Data Science'
    )
    expect(
      normalizeListing({ id: 'legacy-content', category: 'Content Generation' }).category
    ).toBe('Content Writing')
    expect(normalizeListing({ id: 'legacy-research', category: 'Research' }).category).toBe(
      'Research'
    )
    expect(normalizeListing({ id: 'unknown', category: 'Made Up' }).category).toBe(CATEGORIES[0])

    const listing = publishAgent({
      name: 'Legacy category',
      description: 'Maps on the write path too',
      category: 'Data Processing',
      config: {},
    })
    expect(listing.category).toBe('Data Science')
  })
})
