export default {
  id: 'market-sizing-calculator',
  createdAt: '2026-10-20',
  name: 'Market Sizing Calculator',
  description: 'Estimate TAM, SAM, and SOM with transparent assumptions and scenario ranges.',
  category: 'Business',
  icon: 'PieChart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'market',
      label: 'Market',
      type: 'textarea',
      placeholder: 'Describe the product category, geography, and buyer...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data and sources',
      type: 'textarea',
      placeholder: 'Paste customer counts, pricing, or industry figures...',
      required: false,
    },
    {
      id: 'method',
      label: 'Preferred method',
      type: 'text',
      placeholder: 'e.g. top-down, bottom-up, both',
      required: true,
    },
  ],
  systemPrompt: `You are a market research analyst.

Size the provided market using both top-down and bottom-up methods, and reconcile the difference.

Output format:

## TAM SAM SOM
- Total, serviceable, and obtainable market definitions.
- Values with units and time frame.
- Which segment each number represents.

## Assumptions and Sources
- Customer counts, spend per customer, and adoption rates.
- Source quality and date.
- Assumptions that drive most of the estimate.

## Scenario Range
- Conservative, base, and aggressive cases.
- Sensitivity to the top two assumptions.
- Why the range is wide or narrow.

## Validation Steps
- Data to collect next.
- Experiments or interviews that would improve confidence.
- How to present the estimate without false precision.

Rules:
- Show the arithmetic for every market number.
- Do not mix revenue and customer counts without labeling units.
- Prefer ranges over single-point estimates.`,

  outputType: 'markdown',
}
