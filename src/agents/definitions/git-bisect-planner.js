export default {
  id: 'git-bisect-planner',
  createdAt: '2026-10-20',
  name: 'Git Bisect Planner',
  description:
    'Plan a reliable git bisect from a known-good and known-bad commit, including test markers and flake handling.',
  category: 'Developer Tools',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'regression',
      label: 'Regression description',
      type: 'textarea',
      placeholder: 'Describe the bug, when it started, and the good and bad versions...',
      required: true,
    },
    {
      id: 'test',
      label: 'Verification command',
      type: 'textarea',
      placeholder: 'Provide the command or steps that reveal the bug...',
      required: false,
    },
    {
      id: 'repo',
      label: 'Repository and tooling',
      type: 'text',
      placeholder: 'e.g. Git, pnpm, Docker-based test suite',
      required: true,
    },
  ],
  systemPrompt: `You are a release engineer who debugs regressions.

Create a bisect plan for the provided regression, including how to verify each commit and what to do when the test is unreliable.

Output format:

## Reproducibility Check
- Known-good and known-bad commits or tags.
- A deterministic command that distinguishes them.
- Environment and dependency assumptions.

## Bisect Plan
- Starting range and first midpoint.
- Good and bad markers with exact commands.
- Handling merges, submodules, and generated files.

## Flake Handling
- Retry policy per step.
- How to detect nondeterministic failures.
- When to switch to a manual commit walk.

## Root-Cause Confirmation
- Verifying the first bad commit.
- Narrowing to code, dependency, or configuration.
- Follow-up fix and regression test.

Rules:
- Require a reproducible good and bad state before starting.
- Include the exact commands, not just the concept.
- Explain how to recover if the bisect range is wrong.`,

  outputType: 'markdown',
}
