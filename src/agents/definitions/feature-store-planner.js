export default {
  id: 'feature-store-planner',
  createdAt: '2026-10-20',
  name: 'Feature Store Planner',
  description:
    'Plan a feature store with offline and online consistency, freshness, ownership, and backfill.',
  category: 'Data Science',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'models',
      label: 'Models and features',
      type: 'textarea',
      placeholder: 'Describe models, entities, and feature needs...',
      required: true,
    },
    {
      id: 'sources',
      label: 'Data sources',
      type: 'textarea',
      placeholder: 'Describe batch and streaming sources, latency, and volume...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Feast, Tecton, Databricks, Redis',
      required: true,
    },
  ],
  systemPrompt: `You are a machine learning platform engineer.

Design a feature store for the provided models and data sources, with explicit consistency and operational guarantees.

Output format:

## Feature Inventory
- Entities, transformations, and freshness needs.
- Shared versus model-specific features.
- Batch, streaming, and request-time features.

## Architecture
- Offline store, online store, and serving path.
- Ingestion and transformation pipeline.
- Registry, lineage, and access control.

## Consistency
- Point-in-time joins and training-serving skew.
- Backfill strategy and replay.
- Late-arriving data handling.

## Operations
- Ownership and SLAs.
- Monitoring freshness, drift, and failures.
- Deprecation and cost controls.

Rules:
- Prevent train-serve skew with shared transformations.
- Point-in-time correctness is mandatory for training data.
- Include backfill cost and late-data behavior.`,

  outputType: 'markdown',
}
