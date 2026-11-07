import { describe, expect, it } from 'vitest'
import { Bot } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'

describe('agent icon lookup boundaries', () => {
  it('does not accept inherited object keys as icon names', () => {
    for (const name of ['toString', 'constructor', 'hasOwnProperty', '__proto__']) {
      expect(isKnownAgentIcon(name), name).toBe(false)
      expect(resolveAgentIcon(name), name).toBe(Bot)
    }
  })

  it('keeps accepting real exports and the GitHub alias', () => {
    expect(isKnownAgentIcon('Bot')).toBe(true)
    expect(resolveAgentIcon('Bot')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon('Github')).toBe(true)
  })
})
