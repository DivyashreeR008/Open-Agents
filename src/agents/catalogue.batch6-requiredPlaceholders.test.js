import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent required text placeholders', () => {
  it('gives every required free-text input a non-empty placeholder', () => {
    for (const agent of agents) {
      for (const input of agent.inputs) {
        if (!input.required) continue
        if (input.type !== 'text' && input.type !== 'textarea' && input.type !== 'code') continue
        expect(typeof input.placeholder, agent.id + ':' + input.id).toBe('string')
        expect(input.placeholder.trim().length, agent.id + ':' + input.id).toBeGreaterThan(0)
      }
    }
  })
})
