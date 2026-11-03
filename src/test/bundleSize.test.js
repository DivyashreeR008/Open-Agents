import { describe, it, expect } from 'vitest'
import { checkBundleSize, DEFAULT_BUDGETS, ROUTE_PAGE_NAMES } from '../../scripts/check-bundle-size.mjs'

describe('Bundle Size Budget and Route Code Splitting', () => {
  it('passes bundle size check against default agreed budgets', () => {
    const result = checkBundleSize()
    expect(result.passed).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.mainChunk).toBeDefined()
    expect(result.mainChunk.rawSize).toBeLessThanOrEqual(DEFAULT_BUDGETS.maxMainRawBytes)
    expect(result.mainChunk.gzipSize).toBeLessThanOrEqual(DEFAULT_BUDGETS.maxMainGzipBytes)
  }, 15000)

  it('fails and reports clear error when main chunk exceeds a strict raw budget limit', () => {
    // 100 KB limit which is far below the main chunk
    const result = checkBundleSize({ maxMainRawBytes: 100 * 1024 })
    expect(result.passed).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/exceeds limit/)
  }, 15000)

  it('fails and reports clear error when main chunk exceeds a strict gzip budget limit', () => {
    // 50 KB limit which is far below the main chunk gzip size
    const result = checkBundleSize({ maxMainGzipBytes: 50 * 1024 })
    expect(result.passed).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/gzip size/i)
  }, 15000)

  it('verifies route-level pages are split into separate chunks', () => {
    const result = checkBundleSize()
    expect(result.pageChunks.length).toBeGreaterThan(0)

    // Ensure prominent route-level pages are in the code-split chunks
    const chunkNames = result.pageChunks.map((c) => c.name)
    const expectedPages = [
      'HomePage',
      'AgentPage',
      'AboutPage',
      'SuitesPage',
      'SettingsPage',
      'AnalyticsPage',
      'WorkflowLibrary',
      'BattleModeArena',
    ]

    expectedPages.forEach((page) => {
      const found = chunkNames.some((name) => name.startsWith(`${page}-`))
      expect(found).toBe(true)
    })
  }, 15000)

  it('declares all expected route page components in ROUTE_PAGE_NAMES', () => {
    expect(ROUTE_PAGE_NAMES).toContain('HomePage')
    expect(ROUTE_PAGE_NAMES).toContain('AgentPage')
    expect(ROUTE_PAGE_NAMES).toContain('PortfolioPage')
    expect(ROUTE_PAGE_NAMES).toContain('WorkflowBuilder')
    expect(ROUTE_PAGE_NAMES).toContain('BattleModeArena')
    expect(ROUTE_PAGE_NAMES).toContain('NotFoundPage')
  })
})
