#!/usr/bin/env node

// Verifies that a deployed instance returns the browser hardening headers
// declared in vercel.json. Vercel applies the configuration at the edge, so
// checking the file only proves intent; this checks what visitors receive.
//
// Usage:
//   node scripts/check-security-headers.mjs https://your-deployment.example
//   VERIFY_SITE_URL=https://your-deployment.example npm run check:headers

const siteUrl = process.argv[2] || process.env.VERIFY_SITE_URL

if (!siteUrl) {
  console.error('Usage: node scripts/check-security-headers.mjs <site-url>')
  console.error('   or: VERIFY_SITE_URL=<site-url> npm run check:headers')
  process.exit(2)
}

const required = [
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'strict-transport-security',
  'cross-origin-opener-policy',
]

const expected = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'cross-origin-opener-policy': 'same-origin',
}

function fail(message) {
  console.error(`[headers] ${message}`)
  process.exitCode = 1
}

let response
try {
  response = await fetch(siteUrl, { redirect: 'follow' })
} catch (error) {
  fail(`could not reach ${siteUrl}: ${error.message}`)
  process.exit(1)
}

if (!response.ok) {
  fail(`${siteUrl} returned HTTP ${response.status}`)
  process.exit(1)
}

for (const name of required) {
  const value = response.headers.get(name)
  if (!value) {
    fail(`missing ${name}`)
    continue
  }
  if (expected[name] && value !== expected[name]) {
    fail(`${name} is "${value}", expected "${expected[name]}"`)
  }
}

const policy = response.headers.get('content-security-policy') || ''
for (const requiredDirective of [
  "default-src 'self'",
  "script-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
]) {
  if (!policy.includes(requiredDirective)) {
    fail(`content policy is missing "${requiredDirective}"`)
  }
}

if (!process.exitCode) {
  console.log(`[headers] ${siteUrl} returns the complete hardening policy`)
}
