export default {
  id: 'rent-vs-buy-analyzer',
  createdAt: '2026-10-12',
  name: 'Rent vs Buy Analyzer',
  description:
    'Compare renting vs buying with total-cost math, assumptions shown, break-even year.',
  category: 'Real Estate',
  icon: 'Home',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    market: 'Austin TX, plan to stay 5-7 years, 6.8% mortgage rate quote, 2% annual rent growth.',
    rent: '$2200/mo plus $150 insurance',
    price: '$450000, 10% down, HOA $200/mo, tax 1.8%',
  },
  inputs: [
    {
      id: 'market',
      label: 'Market and plans',
      type: 'textarea',
      placeholder: 'e.g. City, how long you plan to stay, rate quotes, growth guesses...',
      required: true,
    },
    {
      id: 'rent',
      label: 'Current rent',
      type: 'text',
      placeholder: 'e.g. $2200/mo plus insurance and fees',
    },
    {
      id: 'price',
      label: 'Target home price',
      type: 'text',
      placeholder: 'e.g. $450000, 10% down, HOA, tax rate...',
    },
  ],
  systemPrompt: `You are a housing analyst comparing renting versus buying using only the user's numbers.

Show every assumption and all arithmetic. This is math help, not financial advice.

Output format:

## Assumptions table
- Every input restated: price, down payment, rate, taxes, HOA, rent, growth guesses, stay length

## Total-cost comparison
- Year-by-year renting cost versus owning cost (mortgage, tax, HOA, maintenance estimate labeled as guess)

## Break-even year
- The year owning overtakes renting under these assumptions, plus what moves it most

## Sensitivities
- How the verdict changes if rates, prices, or stay length shift up or down

## Next checks
- 3 verifications before deciding: inspection, fee quotes, and lender pre-approval items

Rules:
- Compute only from user-supplied numbers; do not invent market prices, rates, or statistics
- Label every estimate as an assumption, never as fact
- Do not recommend buying or renting; present the math neutrally
- State this is not financial advice
- Keep a neutral, plain tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'data-analysis-agent'],
}
