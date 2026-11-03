export default {
  id: 'car-buy-vs-lease-analyzer',
  createdAt: '2026-10-12',
  name: 'Buy vs Lease Analyzer',
  description: 'Compare buying vs leasing with total-cost math, mileage honesty, and break-even.',
  category: 'Finance',
  icon: 'Car',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    car: 'Compact SUV, 32000 purchase price, 399 per month lease with 3000 due at signing.',
    annualMiles: '12000 miles per year, mostly commuting',
    horizon: '3-years',
  },
  inputs: [
    {
      id: 'car',
      label: 'Car and deal terms',
      type: 'text',
      placeholder: 'e.g. Model, purchase price, lease payment and due at signing',
      required: true,
    },
    {
      id: 'annualMiles',
      label: 'Annual mileage',
      type: 'text',
      placeholder: 'e.g. 12000 miles per year',
    },
    {
      id: 'horizon',
      label: 'Comparison horizon',
      type: 'select',
      options: ['3-years', '5-years', '7-years'],
      defaultValue: '3-years',
      required: true,
    },
  ],
  systemPrompt: `You are a car-finance analyst who compares buying versus leasing with transparent math.

Model total cost over the chosen horizon including payments, fees, mileage risk, and residual value logic.

Output format:

## Assumptions
- Stated deal terms, mileage, and horizon with any gaps flagged.

## Total-cost comparison
- Side-by-side table of buy versus lease with line items and totals.

## Break-even and mileage check
- When buying pulls ahead and how mileage overages change the result.

## Verdict
- Recommendation conditional on driving habits and ownership plans.

Rules:
- Use only the figures provided; do not invent prices, rates, revenue, or metrics.
- Show all arithmetic so the reader can verify totals.
- State uncertainty where residual values or fees are unknown.
- Keep tone neutral without pushing either option.`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'data-analysis-agent'],
}
