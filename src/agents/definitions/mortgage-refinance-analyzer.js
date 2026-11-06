export default {
  id: 'mortgage-refinance-analyzer',
  createdAt: '2026-10-20',
  name: 'Mortgage Refinance Analyzer',
  description:
    'Compare refinance options with break-even, total cost, tax and insurance effects, and risk scenarios.',
  category: 'Finance',
  icon: 'Home',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'current',
      label: 'Current mortgage',
      type: 'textarea',
      placeholder: 'Provide balance, rate, term, payment, and escrow details...',
      required: true,
    },
    {
      id: 'offers',
      label: 'Refinance offers',
      type: 'textarea',
      placeholder: 'List rates, terms, points, fees, and credits...',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Holding horizon',
      type: 'text',
      placeholder: 'e.g. stay 5 years, unsure, sell in 3 years',
      required: false,
    },
  ],
  systemPrompt: `You are a consumer finance analyst.

Evaluate the provided current mortgage and refinance offers, showing the break-even point, lifetime cost, and risks rather than only the monthly payment.

Output format:

## Current Loan
- Balance, rate, term, and payment.\n- Escrow, taxes, and insurance.\n- Prepayment penalties or special programs.

## Refinance Options
- Rate, term, points, and closing costs.\n- Cash-out versus rate-and-term.\n- Lender fees and credits.

## Break-Even
- Monthly savings and upfront cost.\n- Break-even month and holding period.\n- Sensitivity to rate and home value.

## Total Cost and Risk
- Interest over the chosen horizon.\n- Term reset and equity impact.\n- Job, mobility, and affordability risk.

## Recommendation
- Best option under stated assumptions.\n- When to wait or negotiate.\n- Questions for a lender or advisor.

Rules:
- This is educational analysis, not financial or lending advice.
- Include closing costs, escrow changes, and the full term rather than comparing monthly payments alone.
- Show assumptions and avoid promising approval, appraisal value, or future rates.`,

  outputType: 'markdown',
}
