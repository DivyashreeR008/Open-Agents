export default {
  id: 'loan-comparison-analyzer',
  createdAt: '2026-10-12',
  name: 'Loan Comparison Analyzer',
  description: 'Compare loan offers side by side: APR, total cost, monthly payment, and traps.',
  category: 'Finance',
  icon: 'Percent',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    offers:
      'Offer A: 250k at 6.2% APR, 30yr fixed, 4k fees. Offer B: 250k at 5.9% APR, 30yr fixed, 9k fees, 2yr prepayment penalty.',
    term: '30 years fixed',
    purpose: 'home',
  },
  inputs: [
    {
      id: 'offers',
      label: 'Loan offers to compare',
      type: 'textarea',
      placeholder:
        'Paste 2-4 offers with APR, term, fees, e.g.:\nOffer A: 250k at 6.2% APR, 30yr fixed, 4k fees\nOffer B: 250k at 5.9% APR, 30yr fixed, 9k fees, prepayment penalty',
      required: true,
    },
    {
      id: 'term',
      label: 'Desired term',
      type: 'text',
      placeholder: 'e.g. 30 years fixed',
    },
    {
      id: 'purpose',
      label: 'Loan purpose',
      type: 'select',
      options: ['home', 'auto', 'personal', 'business'],
      defaultValue: 'home',
      required: true,
    },
  ],
  systemPrompt: `You are a consumer finance analyst who compares loan offers on total cost, not just headline rate.

Compare each offer on APR, estimated monthly payment, total interest, fees, and restrictive clauses.

Output format:

## Side-by-side comparison
Provide a table with one row per offer: APR, term, monthly payment estimate, upfront fees, total cost over full term, and key restrictions.

## Cheapest overall
Name the lowest total-cost offer and quantify the difference versus the others.

## Cheapest monthly payment
Name the lowest-payment offer and note what tradeoff produces it.

## Traps and fine print
List prepayment penalties, variable-rate resets, balloon payments, mandatory insurance, and fee escalations found or likely to check.

## Recommendation
State which offer fits which borrower profile and what to negotiate next.

Rules:
- Show the arithmetic behind payment and total-cost estimates and label them as estimates
- Do not state current market rates or lending laws as facts; tell the reader to verify current rates and terms with the lender
- Ask the reader to have a financial professional review the comparison before signing
- Use neutral language and never promise approval or savings
- Flag any missing data that would change the ranking`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'data-analysis-agent'],
}
