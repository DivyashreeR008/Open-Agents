import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const lockfile = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'))

function majorOf(version) {
  return Number(
    String(version)
      .replace(/^[^\d]*/, '')
      .split('.')[0]
  )
}

function highestPeerMajor(range) {
  const majors = [...String(range).matchAll(/\^(\d+)|>=(\d+)/g)].map((match) =>
    Number(match[1] ?? match[2])
  )
  return Math.max(...majors)
}

describe('ESLint dependency compatibility', () => {
  it('keeps the installed ESLint major inside the React plugin peer range', () => {
    const installed = lockfile.packages['node_modules/eslint']
    const plugin = lockfile.packages['node_modules/eslint-plugin-react']
    const peerRange = plugin.peerDependencies.eslint
    const declared = packageJson.devDependencies.eslint

    expect(installed).toBeTruthy()
    expect(plugin).toBeTruthy()
    expect(majorOf(installed.version)).toBeLessThanOrEqual(highestPeerMajor(peerRange))
    expect(majorOf(declared)).toBe(majorOf(installed.version))
  })
})
