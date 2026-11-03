import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

// Default agreed size budgets for the main bundle.
// Baseline uncompressed: ~1,151 kB (1.18 MB)
// Baseline gzip: ~303 kB
export const DEFAULT_BUDGETS = {
  // Main chunk raw (uncompressed) limit in bytes: 1,280,000 (~1,250 kB / 1.22 MB)
  maxMainRawBytes: 1250 * 1024,
  // Main chunk gzip limit in bytes: 358,400 (~350 kB)
  maxMainGzipBytes: 350 * 1024,
}

/**
 * Calculates raw and gzipped sizes for a given buffer.
 */
function getSizes(buffer) {
  const rawSize = buffer.length
  const gzipSize = zlib.gzipSync(buffer).length
  return {
    rawSize,
    gzipSize,
    rawKb: (rawSize / 1024).toFixed(2),
    gzipKb: (gzipSize / 1024).toFixed(2),
  }
}

export const ROUTE_PAGE_NAMES = [
  'HomePage',
  'AgentPage',
  'BattleModeLanding',
  'BattleModeSetup',
  'BattleModeArena',
  'BattleModeWinner',
  'WorkflowLibrary',
  'WorkflowBuilder',
  'WorkflowDetail',
  'WorkflowRunner',
  'NotFoundPage',
  'SuitesPage',
  'CollectionsPage',
  'CollectionDetailPage',
  'AutomationsPage',
  'AutomationDetailPage',
  'MarketplacePage',
  'MarketplaceDraftsPage',
  'MarketplaceDraftPage',
  'Privacy',
  'TermsOfService',
  'SettingsPage',
  'AnalyticsPage',
  'AboutPage',
  'PortfolioPage',
  'FeedbackPage',
]

/**
 * Checks bundle chunk sizes against agreed size budgets.
 *
 * @param {Object} options
 * @param {string} [options.distDir] - Path to dist directory (defaults to ./dist)
 * @param {number} [options.maxMainRawBytes] - Maximum raw bytes for main chunk
 * @param {number} [options.maxMainGzipBytes] - Maximum gzip bytes for main chunk
 * @returns {{ passed: boolean, mainChunk: Object, pageChunks: Array, allChunks: Array, errors: Array }}
 */
export function checkBundleSize(options = {}) {
  const distDir = options.distDir || path.resolve(process.cwd(), 'dist')
  const assetsDir = path.join(distDir, 'assets')
  const maxMainRawBytes = options.maxMainRawBytes ?? DEFAULT_BUDGETS.maxMainRawBytes
  const maxMainGzipBytes = options.maxMainGzipBytes ?? DEFAULT_BUDGETS.maxMainGzipBytes

  if (!fs.existsSync(distDir) || !fs.existsSync(assetsDir)) {
    throw new Error(
      `Build output not found at ${distDir}. Run "npm run build" before checking bundle size.`
    )
  }

  // Find the entry script from dist/index.html
  const indexPath = path.join(distDir, 'index.html')
  let mainScriptName = null
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8')
    const match = html.match(/<script[^>]+src=["'](?:\.\/|\/)?assets\/([^"']+\.js)["']/i)
    if (match) {
      mainScriptName = match[1]
    }
  }

  const files = fs.readdirSync(assetsDir)
  const jsFiles = files.filter((f) => f.endsWith('.js'))

  if (!mainScriptName) {
    const fallbackMain = jsFiles.find((f) => f.startsWith('index-'))
    if (fallbackMain) {
      mainScriptName = fallbackMain
    }
  }

  if (!mainScriptName) {
    throw new Error('Unable to identify main entry script in dist/assets.')
  }

  const allChunks = []
  let mainChunk = null
  const pageChunks = []

  for (const file of jsFiles) {
    const filePath = path.join(assetsDir, file)
    const content = fs.readFileSync(filePath)
    const sizes = getSizes(content)
    const chunkInfo = {
      name: file,
      path: filePath,
      ...sizes,
    }

    allChunks.push(chunkInfo)

    if (file === mainScriptName) {
      mainChunk = chunkInfo
    } else if (
      ROUTE_PAGE_NAMES.some((pageName) => file.startsWith(`${pageName}-`)) ||
      file.includes('Page-')
    ) {
      pageChunks.push(chunkInfo)
    }
  }

  const errors = []
  if (!mainChunk) {
    errors.push(`Main entry script "${mainScriptName}" was not found in ${assetsDir}.`)
  } else {
    if (mainChunk.rawSize > maxMainRawBytes) {
      const overKb = ((mainChunk.rawSize - maxMainRawBytes) / 1024).toFixed(2)
      errors.push(
        `Main chunk "${mainChunk.name}" raw size (${mainChunk.rawKb} kB) exceeds limit of ${(maxMainRawBytes / 1024).toFixed(2)} kB by ${overKb} kB.`
      )
    }
    if (mainChunk.gzipSize > maxMainGzipBytes) {
      const overGzipKb = ((mainChunk.gzipSize - maxMainGzipBytes) / 1024).toFixed(2)
      errors.push(
        `Main chunk "${mainChunk.name}" gzip size (${mainChunk.gzipKb} kB) exceeds limit of ${(maxMainGzipBytes / 1024).toFixed(2)} kB by ${overGzipKb} kB.`
      )
    }
  }

  return {
    passed: errors.length === 0,
    mainChunk,
    pageChunks,
    allChunks,
    limits: {
      maxMainRawBytes,
      maxMainGzipBytes,
      maxMainRawKb: (maxMainRawBytes / 1024).toFixed(2),
      maxMainGzipKb: (maxMainGzipBytes / 1024).toFixed(2),
    },
    errors,
  }
}

// When executed directly via node scripts/check-bundle-size.mjs
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))

if (isDirectRun || process.argv.includes('--run')) {
  try {
    console.log('📦 Checking bundle size budgets...\n')
    const result = checkBundleSize()

    console.log('--- Baseline Route-Level Page Chunks ---')
    result.pageChunks
      .sort((a, b) => b.rawSize - a.rawSize)
      .forEach((chunk) => {
        console.log(`  • ${chunk.name.padEnd(35)} ${chunk.rawKb.padStart(8)} kB  (gzip: ${chunk.gzipKb.padStart(7)} kB)`)
      })

    console.log('\n--- Main Entry Chunk ---')
    console.log(
      `  • ${result.mainChunk.name.padEnd(35)} ${result.mainChunk.rawKb.padStart(8)} kB  (gzip: ${result.mainChunk.gzipKb.padStart(7)} kB)`
    )
    console.log(
      `  Budget Limit:                       ${result.limits.maxMainRawKb.padStart(8)} kB  (gzip: ${result.limits.maxMainGzipKb.padStart(7)} kB)\n`
    )

    if (!result.passed) {
      console.error('❌ Bundle size budget check FAILED:')
      result.errors.forEach((err) => console.error(`   - ${err}`))
      process.exit(1)
    } else {
      console.log('✅ Bundle size budget check PASSED: Main bundle is within the agreed limit.')
      process.exit(0)
    }
  } catch (err) {
    console.error(`❌ Error during bundle size check: ${err.message}`)
    process.exit(1)
  }
}
