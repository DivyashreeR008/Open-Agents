import { execSync, spawn } from 'node:child_process'

const PORT = 4177
const BASE = `http://localhost:${PORT}`

function log(msg) {
  console.log(`[smoke-test] ${msg}`)
}

function fail(msg) {
  console.error(`[smoke-test] ❌ ${msg}`)
  process.exit(1)
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Wait until the preview server is accepting requests.
async function waitForReady(maxRetries = 80, interval = 250) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${BASE}/`)
      if (res.ok) return true
    } catch {
      // server not up yet
    }
    await sleep(interval)
  }
  return false
}

// Fetch an asset and assert it resolves successfully with a non-empty body.
async function checkAsset(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' })
  if (!res.ok) {
    fail(`Asset ${path} returned HTTP ${res.status}`)
  }
  const body = await res.text()
  if (body.length === 0) {
    fail(`Asset ${path} is empty`)
  }
  return { status: res.status, size: body.length, body }
}

// Extract every script/link asset URL referenced in the built index.html.
function extractAssetUrls(html) {
  const urls = new Set()

  for (const match of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    urls.add(match[1])
  }
  for (const match of html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)) {
    urls.add(match[1])
  }

  return [...urls]
}

async function main() {
  log('Building project (npm run build)...')
  try {
    execSync('npm run build', { stdio: 'inherit' })
  } catch (err) {
    fail('Build failed — see errors above')
  }
  log('Build succeeded')

  log('Starting vite preview server on port', PORT)
  const preview = spawn('npx', ['--no-install', 'vite', 'preview', '--port', String(PORT), '--host'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: { ...process.env },
  })

  let previewOutput = ''
  preview.stdout.on('data', (chunk) => { previewOutput += chunk.toString() })
  preview.stderr.on('data', (chunk) => { previewOutput += chunk.toString() })

  try {
    const ready = await waitForReady()
    if (!ready) {
      fail(`Preview server did not become ready on ${BASE}\n${previewOutput}`)
    }
    log('Preview server is ready')

    log('Fetching built index page...')
    const res = await fetch(`${BASE}/`)
    if (!res.ok) {
      fail(`Index page returned HTTP ${res.status}`)
    }
    const html = await res.text()
    if (!html.includes('id="root"')) {
      fail('Index page is missing the #root mount element')
    }
    log(`Index page OK (${html.length} bytes)`)

    const assetUrls = extractAssetUrls(html).filter((url) => {
      // Skip external resources (fonts, CDN links) — only exercise self-hosted assets.
      return !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')
    })

    log(`Found ${assetUrls.length} self-hosted asset reference(s)`)

    for (const url of assetUrls) {
      const { status, size } = await checkAsset(url)
      log(`  ✓ ${url} — HTTP ${status} (${size} bytes)`)
    }

    // Sanity-check the main JS bundle actually contains the application code,
    // catching bundling/import failures that produce an empty or broken entry.
    const mainScript = html.match(/<script[^>]+src=["'](\/assets\/[^"']+\.js)["']/i)
    if (!mainScript) {
      fail('No main JS bundle script tag found in built index.html')
    }
    const { body: mainBundle } = await checkAsset(mainScript[1])
    const looksLikeReactApp =
      /React|createRoot|hydrateRoot|_react/i.test(mainBundle)
    if (!looksLikeReactApp) {
      fail('Main JS bundle does not appear to contain the React application')
    }
    log(`Main bundle ${mainScript[1]} contains application code (${mainBundle.length} bytes)`)

    log('All smoke checks passed ✅')
  } finally {
    preview.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
