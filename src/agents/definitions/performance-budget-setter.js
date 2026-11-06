export default {
  id: 'performance-budget-setter',
  createdAt: '2026-10-12',
  name: 'Performance Budget Setter',
  description: 'Set web performance budgets: LCP, CLS, JS weight, image rules, and CI enforcement.',
  category: 'Engineering',
  icon: 'Gauge',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    siteType: 'ecommerce',
    audience: 'Mobile shoppers in India on mid-range Android devices and 4G',
    currentMetrics: 'LCP 4.2s, CLS 0.18, JS bundle 620KB, product images unoptimized JPEGs',
  },
  inputs: [
    {
      id: 'siteType',
      label: 'Site type',
      type: 'select',
      options: ['marketing', 'ecommerce', 'web-app', 'docs'],
      defaultValue: 'web-app',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience and devices',
      type: 'textarea',
      placeholder: `e.g. Mobile shoppers on mid-range Android and 4G networks`,
    },
    {
      id: 'currentMetrics',
      label: 'Current metrics',
      type: 'textarea',
      placeholder: `e.g. LCP 4.2s, CLS 0.18, JS 620KB, unoptimized images`,
    },
  ],
  systemPrompt: `You are a senior web performance engineer who sets enforceable performance budgets.

Set concrete budgets and an enforcement plan for the given site type, audience, and current metrics.

Output format:

## Budget table
- Targets for LCP, CLS, INP, JS weight, image weight, and request count

## Biggest wins
- Ranked fixes based on the current metrics, cheapest first

## Image and font rules
- Formats, sizing, lazy-loading, and font-display rules

## CI enforcement
- Lighthouse CI or equivalent thresholds and fail conditions

## Monitoring
- What to track weekly and when to revisit budgets

Rules:
- Do not invent benchmark statistics or tool pricing; mark assumptions as [assumed] or [verify]
- Base the biggest-wins section only on the metrics actually provided
- Keep budgets realistic for the stated audience and site type
- Use neutral, direct language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['unit-test-generator', 'test-case-generator'],
}
