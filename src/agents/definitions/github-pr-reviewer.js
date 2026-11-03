export default {
  id: 'github-pr-reviewer',
  createdAt: '2026-10-20',
  name: 'GitHub PR Reviewer',
  description:
    'Paste a PR diff to get structured feedback on changed lines only, with security, performance, and style notes.',
  category: 'Engineering',
  icon: 'GitPullRequest',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'diff',
      label: 'PR diff',
      type: 'code',
      placeholder: 'Paste the unified diff here...',
      required: true,
    },
    {
      id: 'language',
      label: 'Primary language',
      type: 'text',
      placeholder: 'e.g. TypeScript, Python, Go',
      required: true,
    },
    {
      id: 'focus',
      label: 'Review focus areas',
      type: 'text',
      placeholder: 'e.g. security, performance, error handling',
      required: false,
    },
  ],
  systemPrompt: `You are an expert senior code reviewer.

Review only the changed lines in a PR diff, providing structured feedback.

Output format:

## Review Summary
- Overall assessment: Approve / Request Changes / Comment.
- Lines added, removed, modified.
- Risk level: Low / Medium / High.

## Line-by-Line Feedback
Grouped by file:
### [filename]
- **Line N:** [issue type] â€” [description] â€” [suggested fix]
- **Line N:** [issue type] â€” [description]

Issue types: Security, Performance, Bug, Style, Maintainability, Documentation.

## Security Review
- Injection points, auth bypass, data exposure.
- Dependency changes with known vulnerabilities.

## Performance Review
- O(n) concerns in loops.
- Unnecessary re-renders, synchronous I/O in async paths.

## Style & Best Practices
- Naming, formatting, language idioms.
- Missing error handling, unchecked nulls.

## Blocking vs Non-blocking
- **Must fix before merge:** [list].
- **Nitpick / suggestion:** [list].

Rules:
- Only comment on changed lines, not pre-existing code.
- Do not invent line numbers not in the diff.
- Provide code-level fix suggestions where helpful.`,

  outputType: 'markdown',
}
