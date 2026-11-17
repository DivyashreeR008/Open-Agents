import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const labelsFile = readFileSync('.github/labels.yml', 'utf8')
const guide = readFileSync('docs/LABELS.md', 'utf8')
const issueWorkflow = readFileSync('.github/workflows/issue-auto-label.yml', 'utf8')

const labelNames = [...labelsFile.matchAll(/^\s*-\s*name:\s*['"]?([^'"\n]+)['"]?\s*$/gm)].map(
  (match) => match[1].trim()
)

describe('label lifecycle documentation', () => {
  it('mentions every label defined in labels.yml', () => {
    expect(labelNames.length).toBeGreaterThan(20)
    for (const name of labelNames) {
      expect(guide, `${name} is missing from docs/LABELS.md`).toContain(`\`${name}\``)
    }
  })

  it('documents issue and pull-request lifecycles plus contribution rules', () => {
    expect(guide).toContain('## Issue lifecycle')
    expect(guide).toContain('## Pull request lifecycle')
    expect(guide).toContain('## Contribution rules')
    expect(guide).toContain('45 days')
    expect(guide).toContain('14 more days')
    expect(guide).toContain('21 days')
    expect(guide).toContain('10 quiet days')
  })

  it('matches the difficulty mapping implemented by automation', () => {
    expect(guide).toMatch(/\| `difficulty: easy`\s*\| `level1`/)
    expect(guide).toMatch(/\| `difficulty: medium`\s*\| `level2`/)
    expect(guide).toMatch(/\| `difficulty: hard`\s*\| `level3`/)
    expect(issueWorkflow).toContain("labels.add('level3');")
  })

  it('tells contributors where the labels come from and how to correct them', () => {
    expect(guide).toContain('.github/labels.yml')
    expect(guide).toContain('source of truth')
    expect(guide).toContain('Do not rename a label in the GitHub UI')
    expect(guide).toContain('Comment on an issue before starting work')
  })
})
