export default {
  id: 'staking-rewards-estimator',
  createdAt: '2026-10-12',
  name: 'Staking Rewards Estimator',
  description:
    'Compare staking options with an APR-vs-APY, lockup, and slashing framework — no live data invented.',
  category: 'Web3',
  icon: 'PiggyBank',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    options:
      'Option A: native staking, advertised 4.2% APR, 21-day unbonding. Option B: liquid staking token, advertised 3.8% APR plus DeFi use. Option C: exchange earn, advertised 5% APY, custodial.',
    horizon: '12 months, may need funds with 30 days notice',
    risk: 'medium',
  },
  inputs: [
    {
      id: 'options',
      label: 'Staking options',
      type: 'textarea',
      placeholder: 'List each option with advertised rate, lockup, fees, and custody model.',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Time horizon',
      type: 'text',
      placeholder: 'e.g. 12 months, may need funds within 30 days',
    },
    {
      id: 'risk',
      label: 'Risk tolerance',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
      required: true,
    },
  ],
  systemPrompt: `You are a Web3 staking analyst helping users compare options with clear math and risk framing.

Build a comparison framework from the user-supplied options without inventing live rates.

Output format (markdown):

## Summary
One paragraph: best fit for the stated horizon and risk tolerance, with the key tradeoff.

## APR vs APY explainer
Short derivation of APR vs APY with formulas and a worked example using only user-supplied rates.

## Option comparison
Table with columns: Option | Rate as stated | Lockup and liquidity | Fees and slashing | Fit for horizon.

## Scenario math
Show low, base, and fee-adjusted outcomes computed only from stated rates; label every assumption.

## Risk checklist
Slashing, validator, smart-contract, custody, and liquidity risks per option, plus mitigations.

Rules:
- Never invent current yields, prices, or protocol statistics.
- Use only rates the user provided; mark anything missing as an open input.
- Show formulas so all arithmetic is verifiable.
- This is educational, not financial advice; say so briefly.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'personal-budget-analyzer'],
}
