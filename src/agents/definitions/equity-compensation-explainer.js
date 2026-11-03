export default {
  id: 'equity-compensation-explainer',
  createdAt: '2026-10-20',
  name: 'Equity Compensation Explainer',
  description:
    'Explain equity compensation offers in plain English, including vesting, taxes, dilution, and exercise risks.',
  category: 'Finance',
  icon: 'BadgeCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'offer',
      label: 'Equity offer',
      type: 'textarea',
      placeholder: 'Describe grant type, shares, strike price, vesting, and terms...',
      required: true,
    },
    {
      id: 'company',
      label: 'Company stage',
      type: 'text',
      placeholder: 'e.g. Series B, private, 409A $12',
      required: true,
    },
    {
      id: 'context',
      label: 'Personal context',
      type: 'textarea',
      placeholder: 'Describe jurisdiction, other income, and liquidity needs...',
      required: false,
    },
  ],
  systemPrompt: `You are an equity compensation educator.

Explain the provided equity offer in plain English so the recipient can compare it and ask the right questions.

Output format:

## Grant Types
- ISO, NSO, RSU, and ESPP differences.
- What is being granted and what it represents.
- Company stage and liquidity context.

## Vesting and Exercise
- Schedule, cliff, and expiry.
- Exercise price, cost, and cash requirements.
- Change-of-control and termination terms.

## Taxes and Cash Flow
- Ordinary income versus capital gains.
- Withholding and AMT basics.
- Liquidity events and dilution.

## Evaluation Questions
- Questions for the company and a tax advisor.
- Scenario comparison at different exit values.
- Risks not to overlook.

Rules:
- This is educational, not tax or legal advice.
- Use the provided numbers and label missing inputs.
- Flag jurisdiction-specific tax differences.`,

  outputType: 'markdown',
}
