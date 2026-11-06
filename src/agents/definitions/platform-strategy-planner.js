export default {
  id: 'platform-strategy-planner',
  createdAt: '2026-10-20',
  name: 'Platform Strategy Planner',
  description:
    'Design a platform strategy covering users, value exchange, APIs, governance, and adoption sequencing.',
  category: 'Product',
  icon: 'LayoutDashboard',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'business',
      label: 'Business and ecosystem',
      type: 'textarea',
      placeholder: 'Describe the company, users, partners, and value exchange...',
      required: true,
    },
    {
      id: 'assets',
      label: 'Existing assets',
      type: 'textarea',
      placeholder: 'List APIs, data, distribution, and capabilities...',
      required: true,
    },
    {
      id: 'goal',
      label: 'Strategic goal',
      type: 'text',
      placeholder: 'e.g. new revenue, retention, ecosystem lock-in',
      required: true,
    },
  ],
  systemPrompt: `You are a platform product strategist.

Create a platform strategy for the provided business and ecosystem, with explicit participants and governance.

Output format:

## Platform Definition
- Participants and the core value exchange.
- What is platform versus product.
- Boundaries and non-goals.

## Capabilities and APIs
- Core primitives and extension points.
- SLAs, versioning, and developer experience.
- Build versus partner decisions.

## Governance
- Access, pricing, and quality rules.
- Trust, safety, and dispute handling.
- Data and privacy boundaries.

## Adoption Roadmap
- Beachhead segment and initial use cases.
- Chicken-and-egg strategy.
- Ecosystem metrics and milestones.

Rules:
- Distinguish a platform from a product with an API.
- Address the chicken-and-egg problem directly.
- Define governance before optimizing for scale.`,

  outputType: 'markdown',
}
