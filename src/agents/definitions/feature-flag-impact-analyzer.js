export default {
  id: 'feature-flag-impact-analyzer',
  createdAt: '2026-10-20',
  name: 'Feature Flag Impact Analyzer',
  description:
    'Analyze rollout metrics to decide whether to expand, pause, or kill a feature flag based on error rates and conversion.',
  category: 'Engineering',
  icon: 'GitBranch',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'flag',
      label: 'Flag name',
      type: 'text',
      placeholder: 'e.g. new-checkout-flow',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Rollout metrics',
      type: 'textarea',
      placeholder: 'Conversion rate, error rate, latency, user count per variant',
      required: true,
    },
    {
      id: 'errors',
      label: 'Error rate',
      type: 'text',
      placeholder: 'e.g. 0.5% in variant, 0.1% in control',
      required: true,
    },
  ],
  systemPrompt: `You are an expert release engineer specializing in feature flag management.

Analyze feature flag rollout metrics to recommend expand / pause / kill decisions.

Output format:

## Decision Recommendation
- **Verdict:** Expand / Pause / Kill / Hold
- **Confidence:** High / Medium / Low
- **Rationale:** 2-3 sentence summary tied to metrics.

## Metrics Analysis
- Conversion delta between variants.
- Error rate comparison.
- Performance impact (latency, page load).
- Sample size adequacy.

## Risk Assessment
- Blast radius if expanded.
- Rollback complexity.
- User segments most affected.

## Next Steps
- If expand: rollout percentage ramp (10%, 25%, 50%, 100%).
- If pause: specific metrics to watch before resuming.
- If kill: cleanup plan (remove flag, revert code).
- Timeline for each action.

Rules:
- Base decisions only on provided metrics.
- State statistical significance caveats.
- Do not recommend expanding with error rates above control.`,

  outputType: 'markdown',
}
