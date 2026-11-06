import { describe, expect, it } from 'vitest'
import * as LucideIcons from 'lucide-react'
import GitHubIcon from '../components/GitHubIcon'
import { isKnownAgentIcon, resolveAgentIcon } from './agentIcons'

describe('agent icon resolution', () => {
  it('resolves a built-in lucide name', () => {
    expect(resolveAgentIcon('Bot')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon('Bot')).toBe(true)
  })

  it('maps both GitHub spellings to the local brand mark', () => {
    expect(resolveAgentIcon('Github')).toBe(GitHubIcon)
    expect(resolveAgentIcon('GitHub')).toBe(GitHubIcon)
    expect(isKnownAgentIcon('Github')).toBe(true)
    expect(isKnownAgentIcon('GitHub')).toBe(true)
  })

  it('uses the Bot fallback for missing names', () => {
    expect(resolveAgentIcon()).toBe(LucideIcons.Bot)
    expect(resolveAgentIcon('')).toBe(LucideIcons.Bot)
    expect(resolveAgentIcon(null)).toBe(LucideIcons.Bot)
    expect(resolveAgentIcon(undefined)).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon()).toBe(false)
    expect(isKnownAgentIcon('')).toBe(false)
    expect(isKnownAgentIcon(null)).toBe(false)
  })

  it('uses the Bot fallback for an unknown export', () => {
    expect(resolveAgentIcon('ThisIconDoesNotExist')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon('ThisIconDoesNotExist')).toBe(false)
  })

  it('does not treat a differently cased name as a known export', () => {
    expect(resolveAgentIcon('bot')).toBe(LucideIcons.Bot)
    expect(isKnownAgentIcon('bot')).toBe(false)
  })
})
