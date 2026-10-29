import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ALLOWED_LLM_HOSTS = new Set([
  'api.openai.com',
  'api.anthropic.com',
  'generativelanguage.googleapis.com',
  'openrouter.ai',
  'localhost',
  '127.0.0.1',
])

const ANALYTICS_PATTERNS = [
  { name: 'Google Analytics / Tag Manager', regex: /\b(googletagmanager\.com|google-analytics\.com|gtag\s*\(|_gaq\b)/i },
  { name: 'Analytics & Tracking Services (Mixpanel, PostHog, Amplitude, Hotjar, Clarity, Plausible)', regex: /\b(mixpanel\.(?:init|track)|posthog\.(?:init|capture)|amplitude\.getInstance|clarity\.ms|hotjar\.com|plausible\.io)\b/i },
  { name: 'Segment Analytics', regex: /\b(cdn\.segment\.com|api\.segment\.io|\banalytics\.track\s*\(|\banalytics\.page\s*\()/i },
  { name: 'Telemetry Beacon', regex: /\bnavigator\.sendBeacon\s*\(/i },
]

const CREDENTIAL_STORAGE_PATTERNS = [
  { name: 'Logging credentials / API key', regex: /\bconsole\.(?:log|info|warn|error|debug)\s*\([^)]*\b(apiKey|api_key|apiSecret|api_secret|privateKey|private_key)\b/i },
  { name: 'Persisting credential in document.cookie', regex: /\bdocument\.cookie\s*=.*(?:apiKey|api_key|password|secretKey)/i },
  { name: 'Persisting API key in localStorage', regex: /\blocalStorage\.setItem\s*\([^,]*,\s*(?:JSON\.stringify\([^)]*)?\b(?:apiKey|api_key|plainKey|secretKey)\b/i },
]

export function checkSecurityRules(options = {}) {
  const rootDir = options.rootDir || process.cwd()
  const exceptionsFile = path.join(rootDir, 'security-exceptions.json')
  
  let exceptions = []
  if (fs.existsSync(exceptionsFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(exceptionsFile, 'utf8'))
      exceptions = data.exceptions || []
    } catch (err) {
      console.error(`[security-check] Failed to parse ${exceptionsFile}:`, err)
    }
  }

  function isException(rule, filePath, lineContent) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
    return exceptions.some((ex) => {
      if (ex.rule !== rule) return false
      if (ex.file !== relativePath) return false
      if (ex.pattern && !lineContent.includes(ex.pattern)) return false
      return true
    })
  }

  const violations = []
  const matchedExceptions = []
  let filesScanned = 0

  function scanFile(filePath) {
    filesScanned++
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)

    lines.forEach((line, index) => {
      const lineNum = index + 1

      // 1. Check Analytics / Tracking
      for (const pattern of ANALYTICS_PATTERNS) {
        if (pattern.regex.test(line)) {
          if (isException('no-analytics', filePath, line)) {
            matchedExceptions.push({ rule: 'no-analytics', file: relativePath, line: lineNum, reason: pattern.name })
          } else {
            violations.push({
              rule: 'no-analytics',
              file: relativePath,
              line: lineNum,
              content: line.trim(),
              description: `Found analytics or tracking pattern (${pattern.name})`,
            })
          }
        }
      }

      // 2. Check Credential Storage & Logging
      for (const pattern of CREDENTIAL_STORAGE_PATTERNS) {
        if (pattern.regex.test(line)) {
          if (isException('no-storing-credentials', filePath, line)) {
            matchedExceptions.push({ rule: 'no-storing-credentials', file: relativePath, line: lineNum, reason: pattern.name })
          } else {
            violations.push({
              rule: 'no-storing-credentials',
              file: relativePath,
              line: lineNum,
              content: line.trim(),
              description: `Found credential storage or logging pattern (${pattern.name})`,
            })
          }
        }
      }

      // 3. Check Third-Party Data Transmission
      // External fetch calls in source code
      const fetchMatch = line.match(/\bfetch\s*\(\s*['"`](https?:\/\/([^/'"`?#]+)[^'"`]*)['"`]/i)
      if (fetchMatch) {
        const url = fetchMatch[1]
        const host = fetchMatch[2].toLowerCase()
        if (!ALLOWED_LLM_HOSTS.has(host)) {
          if (isException('no-third-party-data', filePath, line)) {
            matchedExceptions.push({ rule: 'no-third-party-data', file: relativePath, line: lineNum, reason: `Allowed URL: ${url}` })
          } else {
            violations.push({
              rule: 'no-third-party-data',
              file: relativePath,
              line: lineNum,
              content: line.trim(),
              description: `Disallowed network call to third-party host "${host}" (${url})`,
            })
          }
        }
      }

      // Check external script tags in index.html
      if (filePath.endsWith('index.html')) {
        const scriptMatch = line.match(/<script\s+[^>]*src=["'](https?:\/\/([^/'"]+)[^'"]*)["']/i)
        if (scriptMatch) {
          const url = scriptMatch[1]
          const host = scriptMatch[2].toLowerCase()
          if (isException('no-third-party-data', filePath, line)) {
            matchedExceptions.push({ rule: 'no-third-party-data', file: relativePath, line: lineNum, reason: `Allowed script: ${url}` })
          } else {
            violations.push({
              rule: 'no-third-party-data',
              file: relativePath,
              line: lineNum,
              content: line.trim(),
              description: `External remote script included in HTML (${url})`,
            })
          }
        }
      }
    })
  }

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'test' || entry.name === 'definitions') {
          continue
        }
        walkDir(fullPath)
      } else if (entry.isFile()) {
        if (/\.(jsx?|tsx?|html)$/.test(entry.name) && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
          scanFile(fullPath)
        }
      }
    }
  }

  // Scan index.html
  const indexPath = path.join(rootDir, 'index.html')
  if (fs.existsSync(indexPath)) {
    scanFile(indexPath)
  }

  // Scan src/
  const srcPath = path.join(rootDir, 'src')
  if (fs.existsSync(srcPath)) {
    walkDir(srcPath)
  }

  return { violations, matchedExceptions, filesScanned }
}

// CLI execution
const isMain = process.argv[1] && (
  process.argv[1].endsWith('check-security-rules.mjs') ||
  process.argv[1].endsWith('check-security-rules.js')
)

if (isMain) {
  console.log('[security-check] Scanning project against contributor security rules...')
  const { violations, matchedExceptions, filesScanned } = checkSecurityRules()

  console.log(`[security-check] Scanned ${filesScanned} file(s).`)

  if (matchedExceptions.length > 0) {
    console.log(`[security-check] Verified ${matchedExceptions.length} deliberately recorded exception(s):`)
    matchedExceptions.forEach((ex) => {
      console.log(`  ✓ [${ex.rule}] ${ex.file}:${ex.line} (${ex.reason})`)
    })
  }

  if (violations.length > 0) {
    console.error(`\n❌ [security-check] Found ${violations.length} security rule violation(s):\n`)
    violations.forEach((v) => {
      console.error(`  - [${v.rule}] ${v.file}:${v.line}`)
      console.error(`    ${v.description}`)
      console.error(`    Code: ${v.content}\n`)
    })
    console.error('If an exception was accepted by maintainers, record it deliberately in security-exceptions.json.\n')
    process.exit(1)
  }

  console.log('✅ [security-check] All security rule checks passed!')
  process.exit(0)
}

