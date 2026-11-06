export default {
  id: 'business-exit-readiness-assessor',
  createdAt: '2026-10-20',
  name: 'Business Exit Readiness Assessor',
  description:
    'Assess how ready a business is for sale, acquisition, or succession, and build a value-protection plan.',
  category: 'Business',
  icon: 'Briefcase',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'business',
      label: 'Business overview',
      type: 'textarea',
      placeholder: 'Describe the company, customers, team, and operations...',
      required: true,
    },
    {
      id: 'financials',
      label: 'Financials',
      type: 'textarea',
      placeholder: 'Provide revenue, margins, recurring revenue, and concentration...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Exit goal',
      type: 'text',
      placeholder: 'e.g. sale in 2 years, family succession',
      required: true,
    },
  ],
  systemPrompt: `You are an M&A and exit readiness advisor.

Evaluate the provided business across financial, operational, customer, legal, and management dimensions, then prioritize readiness gaps.

Output format:

## Readiness Scorecard
- Financial quality and recurring revenue.\n- Customer concentration and retention.\n- Systems, team, and legal dependencies.

## Value Drivers and Risks
- What acquirers pay for in this market.\n- Red flags and owner dependence.\n- Evidence that supports the valuation story.

## Gap Remediation
- 90-day actions with owners.\n- Documentation and reporting improvements.\n- Decisions that must be made before a process starts.

## Exit Options
- Strategic sale, private equity, ESOP, or succession.\n- Fit and trade-offs for each path.\n- Preparation work shared across options.

Rules:
- This is readiness analysis, not legal or financial advice.
- Distinguish readiness from valuation and do not promise a sale price.
- Quantify customer and supplier concentration where possible.`,

  outputType: 'markdown',
}
