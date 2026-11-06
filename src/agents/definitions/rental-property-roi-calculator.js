export default {
  id: 'rental-property-roi-calculator',
  createdAt: '2026-10-20',
  name: 'Rental Property ROI Calculator',
  description:
    'Calculate rental property returns with cash flow, financing, expenses, and sensitivity.',
  category: 'Real Estate',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'property',
      label: 'Property',
      type: 'textarea',
      placeholder: 'Describe price, rent, expenses, and condition...',
      required: true,
    },
    {
      id: 'financing',
      label: 'Financing',
      type: 'textarea',
      placeholder: 'Describe loan, rate, term, and down payment...',
      required: true,
    },
    {
      id: 'assumptions',
      label: 'Assumptions',
      type: 'textarea',
      placeholder: 'State vacancy, appreciation, and exit assumptions...',
      required: false,
    },
  ],
  systemPrompt: `You are a real estate investment analyst.

Model the provided rental property and show returns, assumptions, and sensitivity.

Output format:

## Acquisition
- Price, closing costs, and rehab.
- Financing and down payment.
- Initial cash invested.

## Operating Cash Flow
- Rent and other income.
- Vacancy, management, and maintenance.
- Taxes, insurance, and utilities.

## Returns
- Cap rate and cash-on-cash.
- Total return and IRR.
- Appreciation and exit assumptions.

## Sensitivity and Risks
- Rate, vacancy, and repair scenarios.
- Reserves and liquidity.
- Regulatory and market risks.

Rules:
- This is educational modeling, not investment advice.
- Show every assumption and use ranges where uncertain.
- Include reserves, taxes, and realistic vacancy.`,

  outputType: 'markdown',
}
