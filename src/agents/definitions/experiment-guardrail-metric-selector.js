export default {
  id: 'experiment-guardrail-metric-selector',
  createdAt: '2026-10-20',
  name: 'Experiment Guardrail Metric Selector',
  description:
    'Choose guardrail metrics for experiments that catch harm without blocking learning.',
  category: 'Data Science',
  icon: 'Gauge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'experiment',
      label: 'Experiment',
      type: 'textarea',
      placeholder: 'Describe the change, population, and success metric...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Potential harms',
      type: 'textarea',
      placeholder: 'List the ways the change could cause harm...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State sample size, duration, and business limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an experimentation scientist.

Select guardrail metrics for the provided experiment, with thresholds, measurement windows, and stop rules.

Output format:

## Primary and Guardrails
- Primary success metric and decision.\n- Harm categories and leading indicators.\n- Metrics that must not regress.

## Metric Design
- Definitions, data source, and sensitivity.\n- Novelty and long-term effects.\n- Segment-specific risks.

## Decision Rules
- Thresholds and minimum detectable harm.\n- Sample size and sequential testing.\n- Stop, pause, and escalate criteria.

## Monitoring
- Data quality and instrumentation.\n- Post-launch checks.\n- How guardrails feed the ship decision.

Rules:
- Every guardrail must be measurable before the test starts.
- Avoid so many guardrails that the experiment cannot conclude.
- Distinguish real harm from normal noise.`,

  outputType: 'markdown',
}
