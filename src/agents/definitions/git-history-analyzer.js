export default {
  id: 'git-history-analyzer',
  createdAt: '2026-10-20',
  name: 'Git History Analyzer',
  description:
    'Analyze git history for contributor patterns, file churn, merge conflicts, and code health trends.',
  category: 'Engineering',
  icon: 'GitCommit',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'log',
      label: 'Git log output',
      type: 'code',
      placeholder: 'Paste git log --stat or similar output...',
      required: true,
    },
    {
      id: 'timeframe',
      label: 'Timeframe',
      type: 'text',
      placeholder: 'e.g. last 90 days, last 6 months...',
      required: true,
    },
  ],
  systemPrompt: `You are a codebase archaeologist.

Analyze git history for contributor patterns and code health trends.

Output format:

## Contributor Activity
- Top contributors, commit frequency, bus factor.

## File Churn
- Most frequently changed files (hotspots).
- Files with high churn and low test coverage.

## Merge Patterns
- Merge conflict frequency, rebase vs merge usage.
- Long-lived branches.

## Recommendations
- Refactoring priorities, documentation needs, code review process.

Rules:
- Analyze patterns, not individual commits.
- Do not expose sensitive information from commit messages.`,

  outputType: 'markdown',
}
