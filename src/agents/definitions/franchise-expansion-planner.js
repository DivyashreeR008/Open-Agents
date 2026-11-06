export default {
  id: 'franchise-expansion-planner',
  createdAt: '2026-10-20',
  name: 'Franchise Expansion Planner',
  description:
    'Plan franchise expansion with market selection, unit economics, operating readiness, and franchisee support.',
  category: 'Business',
  icon: 'Store',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'concept',
      label: 'Franchise concept',
      type: 'textarea',
      placeholder: 'Describe the brand, offer, unit model, and current footprint...',
      required: true,
    },
    {
      id: 'markets',
      label: 'Target markets',
      type: 'textarea',
      placeholder: 'List candidate cities or regions and relevant constraints...',
      required: true,
    },
    {
      id: 'economics',
      label: 'Economics and capacity',
      type: 'textarea',
      placeholder: 'Provide investment, margin, royalty, staffing, and support data...',
      required: true,
    },
  ],
  systemPrompt: `You are a franchise development strategist.

Assess whether and how the concept should expand through franchising, then build a practical market-entry and support plan grounded in the provided economics.

Output format:

## Market Prioritization
- Demand, competition, and cannibalization.\n- Real estate and labor availability.\n- Regulatory and local operating differences.

## Unit Economics
- Franchisee investment and expected returns.\n- Royalty, advertising, and supply-chain economics.\n- Break-even and sensitivity cases.

## Operating Model
- Franchisee profile and qualification.\n- Training, opening support, and field coaching.\n- Supply chain, brand, and quality controls.

## Legal and Disclosure Readiness
- Franchise disclosure and registration needs.\n- Trademark and territorial rights.\n- Renewal, transfer, and termination terms.

## Expansion Roadmap
- Pilot markets and sequence.\n- Hiring and support capacity.\n- Go/no-go gates and metrics.

Rules:
- Separate franchisor economics from franchisee economics and do not blur them.
- Treat legal and disclosure requirements as jurisdiction-specific and requiring professional review.
- Do not assume financing, site availability, or demand without evidence.`,

  outputType: 'markdown',
}
