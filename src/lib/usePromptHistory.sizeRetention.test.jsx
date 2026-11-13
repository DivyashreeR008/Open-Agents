import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  LONG_PROMPT_MIN_BYTES,
  MAX_PROMPT_HISTORY_BYTES,
  PROMPT_HISTORY_RETENTION_RULE,
  PROMPT_HISTORY_STORAGE_KEY,
  usePromptHistory,
} from './usePromptHistory'

function seed(prompts) {
  localStorage.setItem(PROMPT_HISTORY_STORAGE_KEY, JSON.stringify(prompts))
}

function storedBytes() {
  return new TextEncoder().encode(localStorage.getItem(PROMPT_HISTORY_STORAGE_KEY)).length
}

function prompt(id, text, createdAt, extra = {}) {
  return { id, text, favorite: false, createdAt, ...extra }
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('usePromptHistory size-aware retention', () => {
  it('reports actual storage use and the next entry to leave', () => {
    const longText = 'L'.repeat(LONG_PROMPT_MIN_BYTES + 2000)
    seed([
      prompt('short-old', 'Old short prompt', 1),
      prompt('long-new', longText, 2),
      prompt('favorite', 'Pinned short prompt', 3, { favorite: true }),
      prompt('short-new', 'New short prompt', 4),
    ])

    const { result } = renderHook(() => usePromptHistory())
    const usage = result.current.usage

    expect(usage.count).toBe(4)
    expect(usage.maxEntries).toBe(100)
    expect(usage.entriesRemaining).toBe(96)
    expect(usage.sizeBytes).toBe(storedBytes())
    expect(usage.maxBytes).toBe(MAX_PROMPT_HISTORY_BYTES)
    expect(usage.bytesRemaining).toBeGreaterThan(0)
    expect(usage.percentUsed).toBeGreaterThan(0)
    expect(usage.percentUsed).toBeLessThanOrEqual(100)
    expect(usage.nextToEvict.id).toBe('long-new')
    expect(usage.nextToEvictId).toBe('long-new')
    expect(usage.nextToEvictBytes).toBeGreaterThan(LONG_PROMPT_MIN_BYTES)
    expect(usage.nextToEvictReason).toMatch(/Long prompts are removed first/)
    expect(usage.rule).toBe(PROMPT_HISTORY_RETENTION_RULE)
    expect(result.current.stats).toBe(usage)
    expect(result.current.capacity).toBe(usage)
    expect(result.current.nextEviction).toBe(usage.nextToEvict)
  })

  it('falls back to the oldest regular prompt when no entry is long', () => {
    seed([
      prompt('newest', 'Newest', 30),
      prompt('oldest', 'Oldest', 10),
      prompt('middle', 'Middle', 20),
      prompt('favorite', 'Favorite', 5, { favorite: true }),
    ])

    const { result } = renderHook(() => usePromptHistory())

    expect(result.current.nextToEvict.id).toBe('oldest')
    expect(result.current.usage.nextToEvictReason).toBe('This is the oldest regular prompt.')
  })

  it('drops a long entry before ordinary prompts when the entry cap is full', () => {
    const long = prompt('count-long', 'C'.repeat(20_000), 100)
    const favorite = prompt('favorite', 'Keep this favorite', 1, { favorite: true })
    const shorts = Array.from({ length: 98 }, (_, index) =>
      prompt(`count-short-${index}`, `Short prompt ${index}`, 2 + index)
    )
    seed([long, favorite, ...shorts])

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'Newest prompt' }))

    const ids = new Set(result.current.prompts.map((entry) => entry.id))
    expect(result.current.prompts).toHaveLength(100)
    expect(ids.has('count-long')).toBe(false)
    expect(ids.has('favorite')).toBe(true)
    for (const short of shorts) {
      expect(ids.has(short.id)).toBe(true)
    }
  })

  it('removes the largest long entries before ordinary prompts when the budget is full', () => {
    const longSizes = [24_000, 22_000, 20_000, 18_000, 16_000, 14_000, 12_000, 10_000]
    const longs = longSizes.map((size, index) =>
      prompt(`long-${index}`, String.fromCharCode(65 + index).repeat(size), 100 + index)
    )
    const shorts = Array.from({ length: 20 }, (_, index) =>
      prompt(`short-${index}`, `Short prompt ${index} `.repeat(20), 1000 + index)
    )
    seed([...longs, ...shorts])

    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.savePrompt({ text: 'A new short prompt' }))

    const ids = new Set(result.current.prompts.map((entry) => entry.id))
    expect(result.current.prompts).toHaveLength(26)
    expect(ids.has('long-0')).toBe(false)
    expect(ids.has('long-1')).toBe(false)
    expect(ids.has('long-2')).toBe(false)
    for (const short of shorts) {
      expect(ids.has(short.id)).toBe(true)
    }
    expect(result.current.usage.sizeBytes).toBeLessThanOrEqual(MAX_PROMPT_HISTORY_BYTES)
    expect(result.current.usage.isOverByteBudget).toBe(false)
    expect(result.current.usage.nextToEvict.id).toBe('long-3')
  })

  it('keeps short prompts when a new oversized prompt arrives, then drops it first', () => {
    const shorts = Array.from({ length: 10 }, (_, index) =>
      prompt(`short-${index}`, `Useful short prompt ${index}`, 100 + index)
    )
    seed(shorts)
    const { result } = renderHook(() => usePromptHistory())

    act(() => result.current.savePrompt({ text: 'X'.repeat(100_000) }))
    const longEntry = result.current.prompts[0]

    expect(result.current.prompts).toHaveLength(11)
    for (const short of shorts) {
      expect(result.current.prompts.some((entry) => entry.id === short.id)).toBe(true)
    }
    expect(result.current.usage.isOverByteBudget).toBe(true)
    expect(result.current.usage.nextToEvict.id).toBe(longEntry.id)

    act(() => result.current.savePrompt({ text: 'Another useful short prompt' }))

    const ids = new Set(result.current.prompts.map((entry) => entry.id))
    expect(ids.has(longEntry.id)).toBe(false)
    expect(result.current.prompts).toHaveLength(11)
    expect(result.current.usage.sizeBytes).toBeLessThanOrEqual(MAX_PROMPT_HISTORY_BYTES)
    expect(result.current.usage.isOverByteBudget).toBe(false)
    for (const short of shorts) {
      expect(ids.has(short.id)).toBe(true)
    }
  })

  it('never evicts a long favorite to make room for regular prompts', () => {
    seed([
      prompt('favorite-long', 'F'.repeat(60_000), 1, { favorite: true }),
      prompt('regular-long', 'R'.repeat(30_000), 2),
      prompt('regular-short', 'Keep this short prompt', 3),
    ])
    const { result } = renderHook(() => usePromptHistory())

    act(() => result.current.savePrompt({ text: 'Newest short prompt' }))

    const ids = new Set(result.current.prompts.map((entry) => entry.id))
    expect(ids.has('favorite-long')).toBe(true)
    expect(ids.has('regular-long')).toBe(false)
    expect(ids.has('regular-short')).toBe(true)
    expect(result.current.usage.nextToEvict.id).toBe('regular-short')
    expect(result.current.favorites).toHaveLength(1)
  })
})
