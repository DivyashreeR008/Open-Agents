import { beforeAll, describe, expect, it } from 'vitest'
import { suites } from './suitesData'
import { loadAllAgents } from '../agents/registry'

let agents
let agentIds

beforeAll(async () => {
  agents = await loadAllAgents()
  agentIds = new Set(agents.map((agent) => agent.id))
})

describe('suite catalogue contract', () => {
  it('loads a non-empty registry for the contract check', () => {
    expect(agents.length).toBeGreaterThan(0)
    expect(agentIds.size).toBe(agents.length)
  })

  it('contains suites with a stable identity and presentation shape', () => {
    expect(suites.length).toBeGreaterThan(0)
    expect(new Set(suites.map((suite) => suite.id)).size).toBe(suites.length)
    expect(new Set(suites.map((suite) => suite.name)).size).toBe(suites.length)

    for (const suite of suites) {
      expect(suite.id).toMatch(/^[a-z0-9-]+$/)
      expect(suite.name.trim().length).toBeGreaterThan(0)
      expect(suite.description.trim().length).toBeGreaterThan(0)
      expect(suite.icon.trim().length).toBeGreaterThan(0)
      expect(suite.color).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('lists unique, real agent ids in every suite', () => {
    for (const suite of suites) {
      expect(Array.isArray(suite.agents), suite.id).toBe(true)
      expect(suite.agents.length, suite.id).toBeGreaterThan(0)
      expect(new Set(suite.agents).size, `${suite.id} duplicate agent`).toBe(
        suite.agents.length
      )

      for (const agentId of suite.agents) {
        expect(typeof agentId, suite.id).toBe('string')
        expect(agentId.trim(), suite.id).not.toBe('')
        expect(agentIds.has(agentId), `${suite.id} references ${agentId}`).toBe(true)
      }
    }
  })

  it('keeps every quiz question and option structurally complete', () => {
    for (const suite of suites) {
      expect(suite.quiz, suite.id).toBeTruthy()
      expect(Array.isArray(suite.quiz.questions), suite.id).toBe(true)
      expect(suite.quiz.questions.length, suite.id).toBeGreaterThan(0)

      const questionIds = suite.quiz.questions.map((question) => question.id)
      expect(new Set(questionIds).size, `${suite.id} question ids`).toBe(
        questionIds.length
      )

      for (const question of suite.quiz.questions) {
        expect(question.id.trim().length, suite.id).toBeGreaterThan(0)
        expect(question.question.trim().length, suite.id).toBeGreaterThan(0)
        expect(Array.isArray(question.options), suite.id).toBe(true)
        expect(question.options.length, suite.id).toBeGreaterThan(1)

        for (const option of question.options) {
          expect(option.label.trim().length, suite.id).toBeGreaterThan(0)
          expect(Array.isArray(option.tags), suite.id).toBe(true)
          expect(option.tags.length, suite.id).toBeGreaterThan(0)
          expect(new Set(option.tags).size, `${suite.id} duplicate tag`).toBe(
            option.tags.length
          )
        }
      }
    }
  })

  it('points every quiz option at an agent inside its own suite', () => {
    for (const suite of suites) {
      const ownAgents = new Set(suite.agents)

      for (const question of suite.quiz.questions) {
        for (const option of question.options) {
          for (const agentId of option.tags) {
            expect(agentIds.has(agentId), `${suite.id} tag ${agentId}`).toBe(true)
            expect(ownAgents.has(agentId), `${suite.id} tag ${agentId}`).toBe(true)
          }
        }
      }
    }
  })
})
