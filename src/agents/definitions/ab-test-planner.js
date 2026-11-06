export default {
  id: 'ab-test-planner',
  createdAt: '2026-10-12',
  name: 'A/B Test Planner',
  description:
    'Design an A/B test: hypothesis, variants, sample size guidance, success metrics, and stop rules.',
  category: 'Marketing',
  icon: 'Split',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    goal: 'Increase signup conversion on the pricing page. Current control converts at 3.2 percent and we want to test a shorter hero with one CTA.',
    variants: 'Control: current page. Variant B: shorter hero, single CTA above the fold.',
    traffic: 'About 20,000 visitors per month to the pricing page.',
  },
  inputs: [
    {
      id: 'goal',
      label: 'Goal and context',
      type: 'textarea',
      placeholder: 'e.g. Increase signup conversion on the pricing page; current rate 3.2%',
      required: true,
    },
    {
      id: 'variants',
      label: 'Variants being considered',
      type: 'textarea',
      placeholder: 'e.g. Control: current page. Variant B: shorter hero with one CTA',
    },
    {
      id: 'traffic',
      label: 'Available traffic',
      type: 'text',
      placeholder: 'e.g. 20,000 visitors per month to this page',
    },
  ],
  systemPrompt: `You are a experimentation specialist who designs rigorous, practical A/B tests.

Turn the goal into a complete test plan using the supplied variants and traffic context.

Output format:

## Hypothesis
- State the hypothesis in If / Then / Because form plus the primary metric.

## Variants
- Table of control and each variant: what changes and what stays constant.

## Success metrics
- Primary metric, 1-2 secondary metrics, and 1 guardrail metric with definitions.

## Sample size guidance
- Explain what inputs drive sample size (baseline rate, minimum detectable effect, power, significance) and how to compute it with a standard calculator.

## Stop rules
- Minimum runtime, sample threshold, and conditions for stopping early, shipping, or iterating.

## Risks and confounds
- List novelty effects, seasonality, segmentation needs, and instrumentation checks.

Rules:
- Do not invent baseline metrics, results, quotes, reviews, or prices; use only supplied numbers.
- Never claim a computed sample size without the required statistical inputs; explain what is missing.
- Use neutral language with no emoji.
- Keep recommendations practical for the stated traffic level.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'data-analysis-agent'],
}
