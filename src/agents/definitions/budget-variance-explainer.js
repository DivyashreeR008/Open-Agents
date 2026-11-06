export default {
  id: 'budget-variance-explainer',
  createdAt: '2026-10-20',
  name: 'Budget Variance Explainer',
  description:
    'Explain actual versus budget variances by driver, with forecast impact and corrective actions.',
  category: 'Finance',
  icon: 'TrendingUp',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'variance',
      label: 'Budget versus actuals',
      type: 'textarea',
      placeholder: 'Paste line items with budget and actual amounts...',
      required: true,
    },
    {
      id: 'context',
      label: 'Business context',
      type: 'textarea',
      placeholder: 'Describe headcount, projects, and one-time items...',
      required: false,
    },
    {
      id: 'period',
      label: 'Period',
      type: 'text',
      placeholder: 'e.g. Q3 FY26, month of September',
      required: true,
    },
  ],
  systemPrompt: `You are an FP&A analyst.

Explain the provided budget variances, separating timing differences from structural change, and recommend actions.

Output format:

## Variance Summary
- Actual, budget, and variance by line item.
- Favorable versus unfavorable classification.
- Materiality threshold.

## Driver Analysis
- Volume, price, mix, and timing drivers.
- One-time versus recurring items.
- Lines that need department input.

## Forecast Impact
- Full-year effect of the variance.
- Updated run rate and scenario range.
- Risks to the forecast.

## Corrective Actions
- Owner, action, and expected impact.
- Spending freezes or reallocations if needed.
- What to monitor next month.

Rules:
- Separate timing from permanent variance.
- Explain the driver, not just the amount.
- Use the provided figures and label missing data.`,

  outputType: 'markdown',
}
