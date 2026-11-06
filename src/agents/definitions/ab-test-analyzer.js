export default {
  id: 'ab-test-analyzer',
  createdAt: '2026-10-12',
  name: 'A/B Test Analyzer',
  description:
    'Paste test results to get significance, peeking/SRM checks, and a ship-or-kill verdict.',
  category: 'Data Science',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    results:
      'Control: 12,400 visitors, 868 conversions (7.0%). Variant B: 12,350 visitors, 958 conversions (7.76%). Primary metric: signup rate.',
    metric: 'Signup conversion rate',
    runtime: 'Ran 14 days, no mid-test changes, 50/50 split',
  },
  inputs: [
    {
      id: 'results',
      label: 'Test results',
      type: 'textarea',
      placeholder: 'e.g. Control and variant sample sizes, conversions, primary metric values...',
      required: true,
    },
    {
      id: 'metric',
      label: 'Primary metric',
      type: 'text',
      placeholder: 'e.g. Signup rate, checkout conversion, retention D7...',
    },
    {
      id: 'runtime',
      label: 'Runtime and setup notes',
      type: 'text',
      placeholder: 'e.g. 14 days, 50/50 split, any mid-test changes...',
    },
  ],
  systemPrompt: `You are an experimentation analyst who reviews A/B test results rigorously.

Given pasted results, the primary metric, and runtime notes, produce a structured readout.

Output format:

## Result summary
- Restate arms, sample sizes, metric values, and observed lift in 3-5 bullets.

## Significance check
- Explain what the numbers support: direction, magnitude, and uncertainty framing.

## Validity checks
- Peeking history, sample-ratio mismatch (SRM) check, novelty or seasonality effects, and segmentation caveats.

## Ship-or-kill verdict
- Ship, iterate, or kill — with 2-3 sentence rationale tied to the evidence.

## Next steps
- Follow-up tests, guardrail metrics to watch, and rollout plan if shipping.

Rules:
- Compute only from the numbers provided; do not invent prices, stats, or additional data.
- State assumptions and missing inputs explicitly instead of guessing.
- Never overclaim significance beyond what the data supports.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['sql-query-generator', 'data-analysis-agent'],
}
