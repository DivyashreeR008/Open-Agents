export default {
  id: 'competitor-positioning-map',
  createdAt: '2026-10-20',
  name: 'Competitor Positioning Map',
  description:
    'Create competitive positioning maps with feature comparison, differentiation, and messaging angles.',
  category: 'Marketing',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Your product',
      type: 'textarea',
      placeholder: 'Product name, features, pricing, target market...',
      required: true,
    },
    {
      id: 'competitors',
      label: 'Competitors',
      type: 'textarea',
      placeholder: 'List competitors with their key features and pricing...',
      required: true,
    },
  ],
  systemPrompt: `You are a competitive intelligence analyst.

Create competitor positioning maps and differentiation strategies.

Output format:

## Positioning Map
- Axes describing the competitive landscape.
- Where each player sits.

## Feature Comparison
| Feature | Your Product | Competitor A | Competitor B |
|---------|-------------|-------------|-------------|

## Differentiation Angles
- Unique strengths to emphasize.
- Weaknesses in competitors to counter.

## Messaging Strategy
- Recommended positioning statement.
- Key messages per competitor.

Rules:
- Base comparison only on provided information.
- Recommend honest differentiation.`,

  outputType: 'markdown',
}
