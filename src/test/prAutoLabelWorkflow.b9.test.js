import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const workflow = readFileSync('.github/workflows/pr-auto-label.yml', 'utf8')

function workflowScript() {
  const marker = '          script: |\n'
  const start = workflow.indexOf(marker)
  if (start === -1) throw new Error('workflow script block not found')
  const body = workflow.slice(start + marker.length)
  const lines = []
  for (const line of body.split('\n')) {
    if (line.trim() && !line.startsWith('            ')) break
    lines.push(line.startsWith('            ') ? line.slice(12) : '')
  }
  return lines.join('\n')
}

async function runWorkflow({ labels = [], body = '', existingLabels = [] } = {}) {
  let added = null
  const context = {
    repo: { owner: 'owner', repo: 'repository' },
    payload: {
      pull_request: {
        number: 42,
        title: 'fix(ui): tighten the toolbar',
        body,
        labels: existingLabels,
        user: { login: 'contributor' },
      },
    },
  }
  const github = {
    rest: {
      issues: {
        get: async ({ issue_number }) => {
          if (!labels[issue_number]) throw new Error('not found')
          return { data: { labels: labels[issue_number] } }
        },
        addLabels: async ({ labels: next }) => {
          added = next
        },
      },
    },
  }

  const fn = new Function(
    'context',
    'github',
    'console',
    `return (async () => {${workflowScript()}\n})()`
  )
  await fn(context, github, { log: () => {} })
  return added
}

describe('PR auto-label workflow levels', () => {
  it('maps linked-issue difficulty labels to level labels', async () => {
    await expect(
      runWorkflow({ labels: { 10: ['difficulty: easy'] }, body: 'Closes #10' })
    ).resolves.toContain('level1')
    await expect(
      runWorkflow({ labels: { 11: ['difficulty: medium'] }, body: 'Fixes #11' })
    ).resolves.toContain('level2')
    await expect(
      runWorkflow({ labels: { 12: ['difficulty: hard'] }, body: 'Resolves #12' })
    ).resolves.toContain('level3')
  })

  it('uses the hardest linked issue when a PR closes several issues', async () => {
    const labels = {
      20: ['difficulty: easy'],
      21: [{ name: 'difficulty: hard' }],
    }

    const applied = await runWorkflow({
      labels,
      body: 'Closes #20\nFixes #21',
    })

    expect(applied).toContain('level3')
    expect(applied).not.toContain('level1')
  })

  it('falls back to level3 for unlinked or unreadable issues', async () => {
    await expect(runWorkflow({ body: 'No issue reference' })).resolves.toContain('level3')
    await expect(runWorkflow({ body: 'Closes #99' })).resolves.toContain('level3')
  })

  it('does not add a second level label when one is already present', async () => {
    const applied = await runWorkflow({
      labels: { 30: ['difficulty: easy'] },
      body: 'Closes #30',
      existingLabels: [{ name: 'level3' }],
    })

    expect(applied).not.toContain('level1')
    expect(applied).not.toContain('level3')
    expect(applied).toContain('nsoc26')
  })

  it('keeps the conventional-commit type label', async () => {
    const applied = await runWorkflow({ body: 'Closes #99' })

    expect(applied).toEqual(expect.arrayContaining(['nsoc26', 'bug', 'level3']))
  })
})
