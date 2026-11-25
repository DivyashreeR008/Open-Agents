import { beforeEach, expect, it } from 'vitest'
import { formatStorageBytes, measureLocalStorage, measureOriginStorage } from './storageUsage'

beforeEach(() => localStorage.clear())

it('groups and orders approximate UTF-16 sizes without returning raw names or values', () => {
  const entries = [
    ['OpenAgents_history', 'x'.repeat(100)],
    ['oa_analytics', '😀'],
    ['OpenAgents_openai_key', 'private-marker'],
    ['oa_encrypted_vault_v2', 'vault-marker'],
    ['personal-private-name', 'private-note'],
  ]
  for (const [key, value] of entries) localStorage.setItem(key, value)
  const result = measureLocalStorage()
  expect(result.status).toBe('available')
  expect(result.totalBytes).toBe(
    entries.reduce((sum, [key, value]) => sum + 2 * (key.length + value.length), 0)
  )
  expect(result.entryCount).toBe(5)
  expect(result.groups[0].label).toBe('History and prompts')
  expect(result.groups.find((group) => group.label === 'Credential storage').entries).toBe(2)
  expect(result.groups.find((group) => group.label === 'Analytics').bytes).toBe(
    2 * ('oa_analytics'.length + 2)
  )
  for (const [key, value] of entries) {
    expect(JSON.stringify(result)).not.toContain(key)
    expect(JSON.stringify(result)).not.toContain(value)
    expect(localStorage.getItem(key)).toBe(value)
  }
})

it('never reports denied or partially failed reads as an empty store', () => {
  expect(
    measureLocalStorage(() => {
      throw new Error('private error')
    })
  ).toEqual({ status: 'unavailable', totalBytes: null, entryCount: null, groups: [] })
  expect(
    measureLocalStorage(() => ({
      length: 1,
      key: () => 'entry',
      getItem: () => {
        throw new Error('denied')
      },
    })).status
  ).toBe('unavailable')
  expect(measureLocalStorage(() => null).status).toBe('unavailable')
})

it('handles empty stores and entries removed while a snapshot is being read', () => {
  expect(measureLocalStorage()).toMatchObject({ status: 'available', totalBytes: 0, entryCount: 0 })
  expect(
    measureLocalStorage(() => ({
      length: 2,
      key: (index) => (index ? 'removed' : null),
      getItem: () => null,
    }))
  ).toMatchObject({ status: 'available', totalBytes: 0, groups: [] })
})

it('keeps feature names fixed while accounting for collections, marketplace, automations, spend and preferences', () => {
  for (const key of [
    'oa_agent_collections',
    'oa_marketplace_drafts',
    'oa_automations_v2',
    'oa_session_spend',
    'OpenAgents_favorites',
    'oa_theme',
  ])
    localStorage.setItem(key, '1')
  expect(
    measureLocalStorage()
      .groups.map((group) => group.label)
      .sort()
  ).toEqual([
    'App preferences and other data',
    'Automations',
    'Collections',
    'Favorites',
    'Marketplace',
    'Spend records',
  ])
})

it('uses only valid origin API usage/quota fields and labels unsupported or rejected estimates', async () => {
  expect(
    await measureOriginStorage({
      estimate: async () => ({ usage: 80, quota: 100, privateDetail: 'omit' }),
    })
  ).toEqual({ status: 'available', usage: 80, quota: 100, fraction: 0.8 })
  expect(await measureOriginStorage({})).toEqual({ status: 'unsupported' })
  expect(
    await measureOriginStorage({
      estimate: async () => {
        throw new Error('private data')
      },
    })
  ).toEqual({ status: 'unavailable' })
  for (const [usage, quota] of [
    [-1, 10],
    [11, 10],
    [1, 0],
    [NaN, 10],
    [1, Infinity],
    ['1', 10],
    [0, undefined],
  ]) {
    expect(await measureOriginStorage({ estimate: async () => ({ usage, quota }) })).toEqual({
      status: 'unavailable',
    })
  }
})

it('formats bytes with an explicit binary scale, including zero and invalid readings', () => {
  expect(formatStorageBytes(0)).toBe('0 B')
  expect(formatStorageBytes(0.5)).toBe('1 B')
  expect(formatStorageBytes(1024)).toBe('1.0 KiB')
  expect(formatStorageBytes(5 * 1024 ** 2)).toBe('5.0 MiB')
  expect(formatStorageBytes(2 * 1024 ** 3)).toBe('2.0 GiB')
  for (const value of [null, -1, NaN, Infinity])
    expect(formatStorageBytes(value)).toBe('Unavailable')
})
