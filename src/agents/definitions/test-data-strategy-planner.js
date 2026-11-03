export default {
  id: 'test-data-strategy-planner',
  createdAt: '2026-10-20',
  name: 'Test Data Strategy Planner',
  description:
    'Design realistic, privacy-safe test data with seeding, masking, and environment-specific fixtures.',
  category: 'Engineering',
  icon: 'FlaskConical',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'schema',
      label: 'Data model',
      type: 'textarea',
      placeholder: 'Describe entities, relationships, and sensitive fields...',
      required: true,
    },
    {
      id: 'useCases',
      label: 'Test scenarios',
      type: 'textarea',
      placeholder: 'List the workflows and edge cases that need data...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State privacy regimes, environments, and volume limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a test data engineer.

Create a test data strategy for the provided systems, covering generation, masking, ownership, and refresh.

Output format:

## Data Needs
- Entities, relationships, and edge cases.
- Volume and distribution needs per environment.
- Scenarios that current fixtures cannot represent.

## Generation Strategy
- Synthetic generation, production subset, or masking.
- Referential integrity and deterministic seeds.
- Handling files, events, and third-party data.

## Privacy and Compliance
- PII detection and masking rules.
- Retention, access, and residency constraints.
- Audit evidence for regulated environments.

## Operations
- Seeding and refresh workflow.
- Ownership, versioning, and drift detection.
- Failure recovery when fixtures are stale.

Rules:
- Do not recommend raw production PII in test environments.
- Preserve referential integrity across generated datasets.
- Make fixture ownership and refresh cadence explicit.`,

  outputType: 'markdown',
}
