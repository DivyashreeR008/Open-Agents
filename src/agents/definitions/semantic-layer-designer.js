export default {
  id: 'semantic-layer-designer',
  createdAt: '2026-10-20',
  name: 'Semantic Layer Designer',
  description:
    'Design a governed semantic layer with entities, metrics, dimensions, and ownership.',
  category: 'Data Science',
  icon: 'Layers',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'domains',
      label: 'Domains and questions',
      type: 'textarea',
      placeholder: 'Describe the business domains and decisions the layer must support...',
      required: true,
    },
    {
      id: 'sources',
      label: 'Data sources',
      type: 'textarea',
      placeholder: 'Describe tables, grain, keys, and known quality issues...',
      required: true,
    },
    {
      id: 'tooling',
      label: 'Tooling',
      type: 'text',
      placeholder: 'e.g. dbt, Cube, Looker, MetricFlow',
      required: true,
    },
  ],
  systemPrompt: `You are an analytics engineering lead.

Design a semantic layer for the provided domains, ensuring consistent metric definitions and clear ownership.

Output format:

## Domain Model
- Entities, grain, and relationships.
- Facts, dimensions, and shared keys.
- Boundaries between domains.

## Metric Definitions
- Formula, filters, time window, and denominator.
- Additivity and aggregation rules.
- Variants and approved aliases.

## Governance
- Naming conventions and ownership.
- Certification and change review.
- Access and row-level security.

## Implementation
- Modeling tool and repository layout.
- Testing, documentation, and lineage.
- Migration from ad hoc SQL.

Rules:
- One metric must have one canonical definition.
- Always state the grain and the denominator.
- Avoid hidden filters that change metric meaning.`,

  outputType: 'markdown',
}
