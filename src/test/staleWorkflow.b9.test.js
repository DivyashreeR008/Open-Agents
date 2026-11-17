import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const workflow = readFileSync('.github/workflows/stale.yml', 'utf8')
const labels = readFileSync('.github/labels.yml', 'utf8')

function value(name) {
  const match = workflow.match(new RegExp(`^\\s{10}${name}:\\s*(.+)$`, 'm'))
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : null
}

describe('stale issue and pull request workflow', () => {
  it('runs on a schedule and can be started manually', () => {
    expect(workflow).toMatch(/^\s{2}schedule:/m)
    expect(workflow).toMatch(/cron: '17 4 \* \* 1'/)
    expect(workflow).toMatch(/^\s{2}workflow_dispatch:/m)
  })

  it('pins the stale action and grants only issue and pull-request write access', () => {
    expect(workflow).toMatch(/uses: actions\/stale@[0-9a-f]{40} # v11\.0\.0/)
    expect(value('contents')).toBe(null)
    expect(workflow).toMatch(
      /permissions:\n {2}contents: read\n {2}issues: write\n {2}pull-requests: write/
    )
  })

  it('uses separate issue and pull-request grace periods', () => {
    expect(value('days-before-issue-stale')).toBe('45')
    expect(value('days-before-issue-close')).toBe('14')
    expect(value('days-before-pr-stale')).toBe('21')
    expect(value('days-before-pr-close')).toBe('10')
  })

  it('protects assigned, draft, security, and program-labelled work', () => {
    expect(value('exempt-all-assignees')).toBe('true')
    expect(value('exempt-draft-pr')).toBe('true')
    expect(value('remove-stale-when-updated')).toBe('true')
    expect(value('exempt-issue-labels')).toContain('security')
    expect(value('exempt-issue-labels')).toContain('good first issue')
    expect(value('exempt-pr-labels')).toContain('dependencies')
    expect(value('exempt-pr-labels')).toContain('automated')
  })

  it('defines the stale label that the workflow applies', () => {
    expect(value('stale-issue-label')).toBe('stale')
    expect(value('stale-pr-label')).toBe('stale')
    expect(labels).toMatch(/- name: 'stale'\n {2}color: '[0-9a-f]{6}'\n {2}description: /)
  })

  it('processes a bounded batch in oldest-first order', () => {
    expect(value('operations-per-run')).toBe('100')
    expect(value('ascending')).toBe('true')
  })
})
