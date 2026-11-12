import { describe, expect, it } from 'vitest'
import { sanitizeAgentConfig } from './marketplace'

describe('sanitizeAgentConfig circular arrays', () => {
  it('preserves the cycle and still redacts a sibling credential', () => {
    const items = []
    items.push(items)
    const { config, sanitizedFields } = sanitizeAgentConfig({ items, apiKey: 'secret' })

    expect(config.items[0]).toBe(config.items)
    expect(config.apiKey).toBe('YOUR_APIKEY_HERE')
    expect(sanitizedFields).toEqual(['apiKey'])
  })
})
