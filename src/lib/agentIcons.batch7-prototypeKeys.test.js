import { describe, expect, it } from 'vitest'
import * as LucideIcons from 'lucide-react'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'

describe('agent icon prototype safety', () => {
  it('does not resolve inherited object property names as icons', () => {
    for (const name of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
      expect(isKnownAgentIcon(name)).toBe(false)
      expect(resolveAgentIcon(name)).toBe(LucideIcons.Bot)
    }
  })

  it('does not treat non-string values as known icon names', () => {
    expect(isKnownAgentIcon(123)).toBe(false)
    expect(resolveAgentIcon(123)).toBe(LucideIcons.Bot)
  })
})
