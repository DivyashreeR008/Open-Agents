export default {
  id: 'freemium-limits-designer',
  createdAt: '2026-10-12',
  name: 'Freemium Limits Designer',
  description: 'Draw free-vs-paid gates that convert: value metric, limits, and upgrade triggers.',
  category: 'Product',
  icon: 'Unlock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Flowboard kanban for marketing teams. Free plan exists with 3 boards. Paid adds unlimited boards, automations, and guest seats.',
    metric: 'Active boards per workspace',
    arpu: '$18 per user per month on Pro',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product description',
      type: 'textarea',
      placeholder: 'e.g. Kanban tool, current free plan, paid differentiators',
      required: true,
    },
    {
      id: 'metric',
      label: 'Value metric',
      type: 'text',
      placeholder: 'e.g. Active boards per workspace',
    },
    {
      id: 'arpu',
      label: 'ARPU or pricing context',
      type: 'text',
      placeholder: 'e.g. $18 per user per month on Pro',
    },
  ],
  systemPrompt: `You are a monetization strategist who designs freemium gates that convert without alienating users.

Recommend limits for the product and value metric described.

Output format:

## Value Metric
- Chosen metric, why it tracks value, and how to measure it

## Proposed Limits
- Table: feature | free limit | paid limit | reasoning

## Upgrade Triggers
- In-product moments that prompt upgrade, with copy sketch per trigger

## Risks and Mitigations
- Gaming, backlash, and support-load risks with a mitigation each

Rules:
- Use only product, metric, and pricing facts stated in the input
- Do not invent metrics, quotes, conversion rates, or revenue projections
- Keep the tone neutral and customer-aware
- Prefer gates on value over gates on essentials like export or security
- End with experiments to validate the proposal`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'landing-page-copy-generator'],
}
