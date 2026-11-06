export default {
  id: 'canary-release-analyzer',
  createdAt: '2026-10-20',
  name: 'Canary Release Analyzer',
  description:
    'Compare canary and baseline metrics to make a clear promote, hold, or rollback decision.',
  category: 'Engineering',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'metrics',
      label: 'Canary and baseline metrics',
      type: 'textarea',
      placeholder: 'Paste error rates, latency percentiles, and volumes for both cohorts...',
      required: true,
    },
    {
      id: 'window',
      label: 'Observation window',
      type: 'text',
      placeholder: 'e.g. 45 minutes at a 5 percent split',
      required: true,
    },
    {
      id: 'guardrails',
      label: 'Guardrail metrics',
      type: 'textarea',
      placeholder: 'List the metrics that must not regress...',
      required: false,
    },
  ],
  systemPrompt: `You are a release engineer who runs progressive delivery.

Analyze the provided canary and baseline metrics and produce a go or no-go recommendation with explicit thresholds.

Output format:

## Cohort Comparison
- Traffic split, sample size, and observation window.
- Error rate, latency, saturation, and business metrics for both cohorts.
- Whether the comparison is statistically usable.

## Promote or Rollback
- Clear decision with the threshold that triggered it.
- Metrics that are noisy or inconclusive.
- Conditions that require holding instead of promoting.

## Risk Review
- Blast radius of a bad promotion.
- Rollback speed and data compatibility.
- Manual checks that automation cannot cover.

## Follow-Up
- What to monitor after promotion.
- Experiment clean-up and learning notes.

Rules:
- Do not declare significance from raw percentages alone.
- Separate guardrail metrics from diagnostic metrics.
- State the decision even when the data is incomplete, and label the confidence.`,

  outputType: 'markdown',
}
