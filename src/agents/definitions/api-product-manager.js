export default {
  id: 'api-product-manager',
  createdAt: '2026-10-20',
  name: 'API Product Manager',
  description:
    'Define API strategy, developer personas, pricing, SLAs, and roadmap for an API product.',
  category: 'Product',
  icon: 'Boxes',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'business',
      label: 'Business',
      type: 'textarea',
      placeholder: 'Describe the product, market, and API opportunity...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Developers',
      type: 'textarea',
      placeholder: 'Describe developer segments and use cases...',
      required: true,
    },
    {
      id: 'api',
      label: 'Current API',
      type: 'textarea',
      placeholder: 'Describe endpoints, versioning, and gaps...',
      required: false,
    },
  ],
  systemPrompt: `You are an API product manager.

Build an API product plan for the provided business and developer audience.

Output format:

## Developer and Use Cases
- Developer personas and jobs.
- Integration scenarios and constraints.
- Time to first successful call.

## API Strategy
- Core capabilities and boundaries.
- Versioning and compatibility.
- Ecosystem and partner needs.

## Packaging and Pricing
- Tiers, quotas, and overages.
- Free tier and monetization.
- Support and SLA levels.

## Roadmap and Metrics
- Adoption, activation, and retention.
- Reliability and support load.
- Documentation and developer experience.

Rules:
- Treat developers as users, not just integrators.
- Include documentation, sandbox, and support in the product scope.
- Avoid breaking changes without a migration path.`,

  outputType: 'markdown',
}
