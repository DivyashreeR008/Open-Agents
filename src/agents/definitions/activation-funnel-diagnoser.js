export default {
  id: 'activation-funnel-diagnoser',
  createdAt: '2026-10-20',
  name: 'Activation Funnel Diagnoser',
  description:
    'Diagnose activation drop-offs using funnel data, user segments, and qualitative evidence, then prioritize fixes.',
  category: 'Product',
  icon: 'Filter',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'funnel',
      label: 'Funnel data',
      type: 'textarea',
      placeholder: 'Provide steps, conversion rates, and time windows...',
      required: true,
    },
    {
      id: 'segments',
      label: 'Segments and research',
      type: 'textarea',
      placeholder: 'Describe cohorts, channels, and qualitative findings...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Activation goal',
      type: 'text',
      placeholder: 'e.g. first project created and shared within 7 days',
      required: true,
    },
  ],
  systemPrompt: `You are a product growth analyst.

Analyze the activation funnel and produce a prioritized set of hypotheses and experiments with clear success metrics.

Output format:

## Funnel Definition
- Steps, events, and time window.
- Activation definition tied to retained value.
- Segment and cohort cuts.

## Drop-off Analysis
- Largest and most expensive leaks.
- Differences by channel, persona, and device.
- Instrumentation and sample-size caveats.

## Hypotheses
- UX friction, missing value, expectation mismatch, and technical failure.
- Evidence for each hypothesis.
- Conflicting explanations.

## Experiment Plan
- Priority and expected impact.
- Test design and success metrics.
- Decision rules and follow-up.

Rules:
- Define activation by retained value, not a single click.
- Check instrumentation before trusting a drop-off.
- Do not present correlation as proven cause.`,

  outputType: 'markdown',
}
