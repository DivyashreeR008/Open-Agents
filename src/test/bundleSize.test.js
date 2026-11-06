import { randomBytes } from 'node:crypto'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, it, expect } from 'vitest'
import {
  checkBundleSize,
  DEFAULT_BUDGETS,
  ROUTE_PAGE_NAMES,
} from '../../scripts/check-bundle-size.mjs'

const tempDirs = []

function createDistFixture({ mainBuffer = Buffer.from('bundle'), pageChunks = [] } = {}) {
  const distDir = mkdtempSync(path.join(os.tmpdir(), 'open-agents-bundle-size-'))
  const assetsDir = path.join(distDir, 'assets')
  const mainScriptName = 'index-main.js'
  tempDirs.push(distDir)
  mkdirSync(assetsDir)
  writeFileSync(
    path.join(distDir, 'index.html'),
    `<script src="/assets/${mainScriptName}"></script>`
  )
  writeFileSync(path.join(assetsDir, mainScriptName), mainBuffer)

  pageChunks.forEach((name) => {
    writeFileSync(path.join(assetsDir, name), 'page chunk')
  })

  return distDir
}

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop(), { recursive: true, force: true })
  }
})

describe('Bundle Size Budget and Route Code Splitting', () => {
  it('passes bundle size check against default agreed budgets', () => {
    const result = checkBundleSize({
      distDir: createDistFixture({ mainBuffer: Buffer.alloc(100 * 1024, 'a') }),
    })
    expect(result.passed).toBe(true)
    expect(result.errors).toEqual([])
    expect(result.mainChunk).toBeDefined()
    expect(result.mainChunk.rawSize).toBeLessThanOrEqual(DEFAULT_BUDGETS.maxMainRawBytes)
    expect(result.mainChunk.gzipSize).toBeLessThanOrEqual(DEFAULT_BUDGETS.maxMainGzipBytes)
  })

  it('fails and reports clear error when main chunk exceeds a strict raw budget limit', () => {
    const result = checkBundleSize({
      distDir: createDistFixture({ mainBuffer: Buffer.alloc(150 * 1024, 'a') }),
      maxMainRawBytes: 100 * 1024,
    })
    expect(result.passed).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/exceeds limit/)
  })

  it('fails and reports clear error when main chunk exceeds a strict gzip budget limit', () => {
    const result = checkBundleSize({
      distDir: createDistFixture({ mainBuffer: randomBytes(100 * 1024) }),
      maxMainRawBytes: 200 * 1024,
      maxMainGzipBytes: 50 * 1024,
    })
    expect(result.passed).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toMatch(/gzip size/i)
  })

  it('verifies route-level pages are split into separate chunks', () => {
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
    const result = checkBundleSize({
      distDir: createDistFixture({
        pageChunks: expectedPages.map((page) => `${page}-chunk.js`),
      }),
    })
    expect(result.pageChunks.length).toBeGreaterThan(0)

    const chunkNames = result.pageChunks.map((c) => c.name)
    expectedPages.forEach((page) => {
      const found = chunkNames.some((name) => name.startsWith(`${page}-`))
      expect(found).toBe(true)
    })
  })

  it('declares all expected route page components in ROUTE_PAGE_NAMES', () => {
    expect(ROUTE_PAGE_NAMES).toContain('HomePage')
    expect(ROUTE_PAGE_NAMES).toContain('AgentPage')
    expect(ROUTE_PAGE_NAMES).toContain('PortfolioPage')
    expect(ROUTE_PAGE_NAMES).toContain('WorkflowBuilder')
    expect(ROUTE_PAGE_NAMES).toContain('BattleModeArena')
    expect(ROUTE_PAGE_NAMES).toContain('NotFoundPage')
  })
})
