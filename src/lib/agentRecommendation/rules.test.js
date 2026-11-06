import { describe, expect, it } from 'vitest'
import { CAPABILITY_KEYWORDS, TASK_KEYWORDS } from './rules'
import { hasTerm } from './scoring'

describe('task keyword tables', () => {
  it('contain only non-empty strings without duplicates', () => {
    for (const [task, terms] of Object.entries(TASK_KEYWORDS)) {
      expect(Array.isArray(terms), task).toBe(true)
      expect(terms.length, task).toBeGreaterThan(0)
      for (const term of terms) {
        expect(typeof term, `${task} entry`).toBe('string')
        expect(term.trim(), `${task} entry`).not.toBe('')
      }
      expect(new Set(terms).size, `${task} duplicates`).toBe(terms.length)
    }
  })

  it('keeps intentionally shared terms visible across their tables', () => {
    expect(TASK_KEYWORDS.code).toContain('sql')
    expect(TASK_KEYWORDS.technical).toContain('database')
    expect(TASK_KEYWORDS.data).toContain('sql')

    expect(TASK_KEYWORDS.review).toContain('security')
    expect(TASK_KEYWORDS.audit).toContain('security')

    expect(TASK_KEYWORDS.debug).toContain('log')
    expect(TASK_KEYWORDS.summarize).toContain('log')
  })

  it('includes every capability category the explanation layer can mention', () => {
    expect(Object.keys(CAPABILITY_KEYWORDS)).toEqual([
      'toolCalling',
      'fastResponses',
      'visionSupport',
      'structuredOutput',
      'openSource',
      'frequentlyUpdated',
    ])

    for (const terms of Object.values(CAPABILITY_KEYWORDS)) {
      expect(new Set(terms).size).toBe(terms.length)
      expect(terms.every((term) => typeof term === 'string' && term.length > 0)).toBe(true)
    }
  })
})

describe('term matching at word boundaries', () => {
  it('matches complete words and their optional plural form', () => {
    expect(hasTerm('api', 'api')).toBe(true)
    expect(hasTerm('apis', 'api')).toBe(true)
    expect(hasTerm('logs', 'log')).toBe(true)
    expect(hasTerm('models', 'model')).toBe(true)
  })

  it('does not match a term embedded inside another word', () => {
    expect(hasTerm('rapid', 'api')).toBe(false)
    expect(hasTerm('scam', 'api')).toBe(false)
    expect(hasTerm('recap', 'cap')).toBe(false)
    expect(hasTerm('logarithm', 'log')).toBe(false)
  })

  it('does not accept a singular when the stored term is already plural', () => {
    expect(hasTerm('log', 'logs')).toBe(false)
  })

  it('matches multi-word phrases that appear in the tables', () => {
    expect(hasTerm('supports tool calling', 'tool calling')).toBe(true)
    expect(hasTerm('an open source project', 'open source')).toBe(true)
    expect(hasTerm('an open-source project', 'open-source')).toBe(true)
    expect(hasTerm('a CI/CD pipeline', 'ci/cd')).toBe(true)
    expect(hasTerm('a smart contract review', 'smart contract')).toBe(true)
  })

  it('is case-insensitive and rejects empty inputs', () => {
    expect(hasTerm('API', 'api')).toBe(true)
    expect(hasTerm('Open Source', 'open source')).toBe(true)
    expect(hasTerm('', 'api')).toBe(false)
    expect(hasTerm('api', '')).toBe(false)
    expect(hasTerm(undefined, 'api')).toBe(false)
  })
})
