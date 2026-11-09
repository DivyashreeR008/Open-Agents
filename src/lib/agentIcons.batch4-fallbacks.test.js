import { describe, expect, it } from 'vitest'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'
import GitHubIcon from '../components/GitHubIcon'

describe('agent icon fallbacks', () => {
  it('uses the bot icon for empty and unknown names', () => {
    expect(resolveAgentIcon()).toBe(resolveAgentIcon(''))
    expect(resolveAgentIcon('DefinitelyNotALucideIcon')).toBe(resolveAgentIcon(null))
  })

  it('aliases both GitHub spellings and reports known icons', () => {
    expect(resolveAgentIcon('Github')).toBe(GitHubIcon)
    expect(resolveAgentIcon('GitHub')).toBe(GitHubIcon)
    expect(isKnownAgentIcon('Github')).toBe(true)
    expect(isKnownAgentIcon('not-real')).toBe(false)
    expect(isKnownAgentIcon('')).toBe(false)
  })
})
