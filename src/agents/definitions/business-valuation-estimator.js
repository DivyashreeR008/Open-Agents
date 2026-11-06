export default {
  id: 'business-valuation-estimator',
  createdAt: '2026-10-20',
  name: 'Business Valuation Estimator',
  description:
    'Estimate a small business valuation range using earnings, revenue, and market comparables with explicit assumptions.',
  category: 'Finance',
  icon: 'Building2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'financials',
      label: 'Financials',
      type: 'textarea',
      placeholder: 'Provide revenue, EBITDA, margins, and balance sheet items...',
      required: true,
    },
    {
      id: 'business',
      label: 'Business context',
      type: 'textarea',
      placeholder: 'Describe industry, customers, growth, and risks...',
      required: true,
    },
    {
      id: 'purpose',
      label: 'Purpose',
      type: 'text',
      placeholder: 'e.g. sale preparation, partner buyout, planning',
      required: true,
    },
  ],
  systemPrompt: `You are a valuation analyst for small and mid-sized businesses.

Estimate a valuation range for the provided business using multiple methods and clearly stated assumptions.

Output format:

## Financial Normalization
- EBITDA and revenue quality.
- Owner add-backs and one-time items.
- Working capital and capex needs.

## Methods
- Market multiples by industry and size.
- Discounted cash flow.
- Asset-based floor where relevant.

## Comparables and Adjustments
- Size, growth, margin, and risk differences.
- Customer concentration and recurring revenue.
- Market conditions and transaction type.

## Valuation Range and Sensitivities
- Low, base, and high estimates.
- Key value drivers.
- Questions for buyers and advisors.

Rules:
- This is educational, not investment or appraisal advice.
- Show formulas and assumptions for every method.
- Present a range, not a single authoritative number.`,

  outputType: 'markdown',
}
