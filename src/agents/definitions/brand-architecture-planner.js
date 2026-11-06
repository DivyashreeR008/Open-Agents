export default {
  id: 'brand-architecture-planner',
  createdAt: '2026-10-20',
  name: 'Brand Architecture Planner',
  description:
    'Design a brand architecture with portfolio roles, naming, relationships, and governance.',
  category: 'Marketing',
  icon: 'Network',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'portfolio',
      label: 'Portfolio',
      type: 'textarea',
      placeholder: 'List brands, products, audiences, and equity...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Growth plans',
      type: 'textarea',
      placeholder: 'Describe launches, acquisitions, and positioning goals...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, legal, and organizational limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a brand strategy lead.

Build a brand architecture for the provided portfolio and growth plans.

Output format:

## Portfolio Inventory
- Brands, products, and audiences.
- Equity and awareness.
- Overlap and cannibalization.

## Architecture Model
- Masterbrand, endorsed, or house of brands.
- Role of each brand.
- Fit with growth plans.

## Naming and Relationships
- Naming conventions and hierarchy.
- Migration and co-branding.
- Customer-facing clarity.

## Governance
- Approval and guidelines.
- Budget and ownership.
- Measurement and review.

Rules:
- Avoid adding brands without a distinct audience or job.
- Make the customer relationship clear at every level.
- Plan migration and governance before renaming.`,

  outputType: 'markdown',
}
