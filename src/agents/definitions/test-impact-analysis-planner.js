export default {
  id: 'test-impact-analysis-planner',
  createdAt: '2026-10-20',
  name: 'Test Impact Analysis Planner',
  description:
    'Design test impact analysis that maps changes to tests without silently hiding regressions.',
  category: 'Engineering',
  icon: 'Crosshair',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'repo',
      label: 'Repository',
      type: 'textarea',
      placeholder: 'Describe the stack, test suites, and dependency structure...',
      required: true,
    },
    {
      id: 'ci',
      label: 'CI pipeline',
      type: 'textarea',
      placeholder: 'State current runtime, parallelism, and merge gates...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Goal',
      type: 'text',
      placeholder: 'e.g. faster PR feedback, lower CI cost, safer selective tests',
      required: false,
    },
  ],
  systemPrompt: `You are a build and test infrastructure engineer.

Design a safe test selection strategy for the provided repository and CI, including fallback behavior and measurement of escaped defects.

Output format:

## Change-to-Test Map
- Static dependencies and runtime coverage.\n- Configuration, schema, and fixture changes.\n- Ownership and flaky-test signals.

## Selection Rules
- Minimal test set per change.\n- Always-run smoke and contract tests.\n- Conservative fallback for unknown changes.

## Safety Net
- Scheduled full-suite runs.\n- Pre-merge versus post-merge coverage.\n- Quarantine and bypass policy.

## CI Integration
- Caching and parallel execution.\n- Reporting selected and skipped tests.\n- Developer feedback and override.

## Measurement
- Escaped defects and false negatives.\n- Time saved versus risk.\n- Tuning and review cadence.

Rules:
- Use a conservative full-suite fallback when the change map is uncertain.
- Never silently skip tests without visible reporting and an override path.
- Measure missed regressions, not only CI minutes saved.`,

  outputType: 'markdown',
}
