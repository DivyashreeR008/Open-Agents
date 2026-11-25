import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSearchHistory } from './useSearchHistory'

const key = 'oa_search_history_v1'
const entry = (query, extra = {}) => ({ surface: 'catalogue', query, ...extra })
beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

describe('device-local search history', () => {
  it('deduplicates case and scope order, retaining latest spelling, distinct scopes and ten entries', () => {
    const { result } = renderHook(useSearchHistory)
    act(() => {
      result.current.remember(entry('  Alpha ', { scope: 'provider=openai&category=Engineering' }))
      result.current.remember(entry('ALPHA', { scope: 'category=Engineering&provider=openai' }))
      result.current.remember(entry('ALPHA', { scope: 'provider=anthropic', view: 'grid' }))
    })
    expect(result.current.entries).toHaveLength(2)
    expect(result.current.entries[1].query).toBe('ALPHA')
    expect(result.current.entries[0].view).toBe('grid')
    act(() => {
      for (let i = 0; i < 12; i++) result.current.remember(entry(`Query ${i}`))
    })
    expect(result.current.entries.map((e) => e.query)).toEqual(
      Array.from({ length: 10 }, (_, i) => `Query ${11 - i}`)
    )
    expect(JSON.parse(localStorage.getItem(key))).toHaveLength(10)
  })

  it('stores only safe query context, not arbitrary navigation, payloads or credentials', () => {
    const { result, unmount } = renderHook(useSearchHistory)
    act(() =>
      result.current.remember(
        entry('<img src=x onerror=alert(1)>', {
          scope:
            'provider=openai&collection=work&category=Engineering&ready=1&token=secret&redirect=https://bad.test',
          view: 'grid',
          token: 'secret',
          url: 'javascript:alert(1)',
        })
      )
    )
    const saved = result.current.entries[0]
    expect(Object.keys(saved).sort()).toEqual(['id', 'query', 'scope', 'surface', 'view'])
    const params = new URLSearchParams(saved.scope)
    expect([...params.keys()]).toEqual(['category', 'collection', 'provider', 'q', 'ready'])
    expect(localStorage.getItem(key)).not.toContain('secret')
    unmount()
    expect(renderHook(useSearchHistory).result.current.entries).toEqual([saved])
  })

  it('synchronizes mounts, preserves unrelated data, and handles external storage and clear events', () => {
    localStorage.setItem('OpenAgents_history', 'unrelated')
    const a = renderHook(useSearchHistory),
      b = renderHook(useSearchHistory)
    act(() => a.result.current.remember(entry('one')))
    expect(b.result.current.entries).toHaveLength(1)
    act(() => b.result.current.remember({ surface: 'palette', query: 'two' }))
    expect(a.result.current.entries).toHaveLength(2)
    act(() => a.result.current.remove(a.result.current.entries[1].id))
    expect(b.result.current.entries[0].query).toBe('two')
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated' })))
    expect(b.result.current.entries).toHaveLength(1)
    act(() => {
      localStorage.setItem(key, JSON.stringify([entry('external')]))
      window.dispatchEvent(new StorageEvent('storage', { key }))
    })
    expect(a.result.current.entries[0].query).toBe('external')
    act(() => b.result.current.clear())
    expect(a.result.current.entries).toEqual([])
    expect(localStorage.getItem('OpenAgents_history')).toBe('unrelated')
    act(() => {
      a.result.current.remember(entry('again'))
      localStorage.removeItem(key)
      window.dispatchEvent(new StorageEvent('storage', { key: null }))
    })
    expect(a.result.current.entries).toEqual([])
  })

  it.each(['{broken', '{}'])('preserves malformed bytes %s until explicit clear', (bytes) => {
    localStorage.setItem(key, bytes)
    const { result } = renderHook(useSearchHistory)
    expect(result.current.error).toMatch(/could not be read/)
    act(() => expect(result.current.remember(entry('new'))).toBe(false))
    expect(localStorage.getItem(key)).toBe(bytes)
    act(() => expect(result.current.clear()).toBe(true))
    act(() => expect(result.current.remember(entry('new'))).toBe(true))
  })

  it('filters invalid persisted rows without writing during read', () => {
    const bytes = JSON.stringify([
      null,
      { query: 'x', surface: 'other' },
      entry(''),
      entry('x'.repeat(301)),
      entry('valid'),
      entry('VALID'),
    ])
    localStorage.setItem(key, bytes)
    const { result } = renderHook(useSearchHistory)
    expect(result.current.entries.map((e) => e.query)).toEqual(['valid'])
    expect(localStorage.getItem(key)).toBe(bytes)
    act(() => expect(result.current.remember(entry('x'.repeat(301)))).toBe(false))
    expect(localStorage.getItem(key)).toBe(bytes)
  })

  it('reports storage failures without false saves, removals or clears, then recovers', () => {
    const { result } = renderHook(useSearchHistory)
    act(() => result.current.remember(entry('keep')))
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    act(() => expect(result.current.remember(entry('lost'))).toBe(false))
    act(() => expect(result.current.remove(result.current.entries[0].id)).toBe(false))
    expect(result.current.entries[0].query).toBe('keep')
    expect(result.current.error).toMatch(/could not be saved/)
    set.mockRestore()
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    act(() => expect(result.current.clear()).toBe(false))
    expect(result.current.entries).toHaveLength(1)
    expect(result.current.error).toMatch(/could not be cleared/)
    remove.mockRestore()
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    act(() => expect(result.current.remember(entry('lost'))).toBe(false))
    expect(result.current.error).toMatch(/could not be read/)
    get.mockRestore()
    act(() => expect(result.current.clear()).toBe(true))
    expect(result.current.error).toBe('')
  })
})
