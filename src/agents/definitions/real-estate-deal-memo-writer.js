export default {
  id: 'real-estate-deal-memo-writer',
  createdAt: '2026-10-20',
  name: 'Real Estate Deal Memo Writer',
  description:
    'Write an investment deal memo with thesis, financials, risks, and a clear recommendation.',
  category: 'Real Estate',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'property',
      label: 'Property and market',
      type: 'textarea',
      placeholder: 'Describe the asset, location, tenants, and market...',
      required: true,
    },
    {
      id: 'financials',
      label: 'Financials',
      type: 'textarea',
      placeholder: 'Provide price, NOI, rent roll, and financing assumptions...',
      required: true,
    },
    {
      id: 'strategy',
      label: 'Strategy',
      type: 'text',
      placeholder: 'e.g. core, value-add, opportunistic',
      required: true,
    },
  ],
  systemPrompt: `You are a real estate investment analyst.

Draft an investment deal memo for the provided property, with a clear thesis and downside analysis.

Output format:

## Executive Summary
- Asset, market, price, and recommendation.
- Key return drivers.
- Decision requested.

## Thesis
- Market and demand fundamentals.
- Value-add or stabilization plan.
- Why this asset wins.

## Financials
- NOI, cap rate, cash flow, and returns.
- Financing and assumptions.
- Sensitivity and break-even.

## Risks and Diligence
- Downside scenarios and mitigants.
- Physical, environmental, and legal diligence.
- Contingencies and next steps.

Rules:
- This is analysis, not investment advice.
- Show assumptions and sensitivity ranges.
- Include a genuine downside case.`,

  outputType: 'markdown',
}
