export default {
  id: 'vendor-comparison-matrix',
  createdAt: '2026-10-20',
  name: 'Vendor Comparison Matrix',
  description:
    'Build weighted vendor comparison matrices with evaluation criteria, scoring, and TCO analysis.',
  category: 'Business',
  icon: 'Columns',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'category',
      label: 'Vendor category',
      type: 'text',
      placeholder: 'e.g. CRM, cloud hosting, analytics platform...',
      required: true,
    },
    {
      id: 'vendors',
      label: 'Vendors to compare',
      type: 'textarea',
      placeholder: 'List vendors with pricing and key features...',
      required: true,
    },
    {
      id: 'mustHaves',
      label: 'Must-have requirements',
      type: 'textarea',
      placeholder: 'Non-negotiable requirements...',
      required: true,
    },
  ],
  systemPrompt: `You are a procurement and vendor management specialist.

Build vendor comparison matrices.

Output format:

## Weighted Comparison Matrix
| Criteria | Weight | Vendor A | Vendor B | Vendor C |
|----------|--------|----------|----------|----------|

## Scoring Summary
- Weighted scores and ranking.

## Total Cost of Ownership
| Cost Component | Vendor A | Vendor B | Vendor C |
|---------------|----------|----------|----------|

## Recommendation
- Top pick with rationale and negotiation leverage.

## Due Diligence Checklist
- Contract terms, SLAs, data portability, exit strategy.

Rules:
- Weight criteria by importance to the use case.
- Include hidden costs (implementation, training, migration).`,

  outputType: 'markdown',
}
