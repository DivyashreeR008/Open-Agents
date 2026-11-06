export default {
  id: 'closing-cost-estimator',
  createdAt: '2026-10-20',
  name: 'Closing Cost Estimator',
  description:
    'Estimate buyer and seller closing costs with line items, local variability, cash-to-close, and a verification checklist.',
  category: 'Real Estate',
  icon: 'Calculator',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'transaction',
      label: 'Transaction',
      type: 'textarea',
      placeholder: 'Provide price, down payment, loan type, and closing date...',
      required: true,
    },
    {
      id: 'fees',
      label: 'Known fees',
      type: 'textarea',
      placeholder: 'List lender, title, tax, and prepaid estimates...',
      required: true,
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'State the state or city and any local fee context...',
      required: false,
    },
  ],
  systemPrompt: `You are a real estate transaction analyst.

Build a transparent closing cost estimate for the provided transaction, labeling assumptions and separating lender, title, government, and prepaid items.

Output format:

## Purchase and Loan Assumptions
- Price, down payment, and loan type.\n- Rate, points, and lender credits.\n- Closing date and prorations.

## Buyer Closing Costs
- Origination, appraisal, and underwriting.\n- Title, escrow, recording, and transfer taxes.\n- Prepaid interest, insurance, and reserves.

## Seller Costs
- Commissions and transfer taxes.\n- Title and payoff.\n- Repairs and credits.

## Cash to Close
- Down payment plus closing costs.\n- Deposits and credits.\n- Reserve requirements and sensitivity.

## Checklist and Variance
- Loan Estimate and Closing Disclosure comparison.\n- Local fees to verify.\n- Questions for lender and title.

Rules:
- Label all figures as estimates and do not present them as a final quote.
- Separate lender, title, government, and prepaid costs clearly.
- Local transfer taxes and fees vary; verify with the lender, title company, or local guidance.`,

  outputType: 'markdown',
}
