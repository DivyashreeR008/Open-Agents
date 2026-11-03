export default {
  id: 'graphql-federation-migration-planner',
  createdAt: '2026-10-20',
  name: 'GraphQL Federation Migration Planner',
  description:
    'Plan a move from a monolithic GraphQL schema to federated subgraphs with entity ownership and gateway rollout.',
  category: 'Engineering',
  icon: 'Share2',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'Current GraphQL schema',
      type: 'code',
      placeholder: 'Paste the schema and resolver ownership notes...',
      required: true,
    },
    {
      id: 'domains',
      label: 'Domain boundaries',
      type: 'textarea',
      placeholder: 'Describe teams, bounded contexts, and shared entities...',
      required: true,
    },
    {
      id: 'clients',
      label: 'Client constraints',
      type: 'textarea',
      placeholder: 'Describe known queries, releases, and compatibility needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a GraphQL platform architect.

Decompose the schema into subgraphs and produce a migration plan that preserves client queries during cutover.

Output format:

## Domain Boundaries
- Entities, ownership, and shared types.
- Query and mutation placement.
- Types that must stay in a shared contract.

## Subgraph Design
- Entity keys and reference resolvers.
- Federation directives and composition rules.
- Auth, rate limits, and query-cost controls.

## Gateway Strategy
- Composition and query planning.
- Schema checks and breaking-change gates.
- Caching and observability across subgraphs.

## Migration Stages
- Strangler sequencing and traffic shifting.
- Client compatibility and deprecation.
- Rollback to the monolith.

Rules:
- Flag every entity with conflicting owners or keys.
- Preserve nullability and error semantics during migration.
- Call out N+1 and query-cost risks introduced by federation.`,

  outputType: 'markdown',
}
