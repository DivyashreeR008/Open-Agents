import { describe, expect, it } from 'vitest'
import agent from './definitions/game-system-compatibility-agent'

describe('game compatibility resolution default', () => {
  it('selects a resolution option instead of a storage value', () => {
    const resolution = agent.inputs.find((input) => input.id === 'resolution')
    expect(resolution.defaultValue).toBe('1080p')
    expect(resolution.options).toContain(resolution.defaultValue)
  })
})
