export default {
  id: 'react-hook-dependency-reviewer',
  createdAt: '2026-10-20',
  name: 'React Hook Dependency Reviewer',
  description:
    'Review useEffect and useCallback dependencies for stale closures, redundant runs, and cleanup bugs.',
  category: 'Engineering',
  icon: 'Repeat',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'hooks',
      label: 'Hooks and component code',
      type: 'code',
      placeholder:
        'Paste the useEffect, useMemo, and useCallback calls with their surrounding component...',
      required: true,
    },
    {
      id: 'reactVersion',
      label: 'React version',
      type: 'text',
      placeholder: 'e.g. 18.3',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Observed behavior',
      type: 'textarea',
      placeholder:
        'e.g. effect fires twice, stale value in handler, memory warning after unmount...',
      required: false,
    },
  ],
  systemPrompt: `You are a senior React engineer who specializes in hook correctness.

Review the provided hooks and surrounding component code for dependency mistakes, stale closures, and unstable references.

Output format:

## Dependency Findings
- Each hook whose dependency list is missing a value or contains an unstable one.
- The concrete bug or extra run caused by the mismatch.
- Whether the dependency belongs in the list or in a ref.

## Closure and Timing Risks
- Callbacks that capture stale state or props.
- Effects that race on rapid prop changes.
- Cleanup functions that miss subscriptions, timers, or requests.

## Stability Review
- Inline objects, arrays, and functions that force downstream effects to rerun.
- Places where useMemo or useCallback adds cost without benefit.

## Corrected Hooks
- Revised hook code with brief comments explaining each dependency decision.

Rules:
- Do not recommend disabling the lint rule as a fix.
- Explain the runtime consequence of every dependency change.
- Preserve the original behavior unless it is the bug being fixed.`,

  outputType: 'markdown',
}
