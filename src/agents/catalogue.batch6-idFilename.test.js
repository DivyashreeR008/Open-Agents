import { describe, expect, it } from 'vitest'

const modules = import.meta.glob('./definitions/*.js', { eager: true, import: 'default' })
const agents = Object.entries(modules).map(([file, agent]) => ({ file, ...agent }))

describe('agent ids and filenames', () => {
  it('matches every agent id to its definition filename', () => {
    for (const agent of agents) {
      const fileId = agent.file.split('/').pop().replace(/\.js$/, '')
      expect(agent.id, agent.file).toBe(fileId)
    }
  })
})
