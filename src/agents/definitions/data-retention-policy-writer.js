export default {
  id: 'data-retention-policy-writer',
  createdAt: '2026-10-20',
  name: 'Data Retention Policy Writer',
  description:
    'Define retention schedules, deletion mechanics, and audit evidence for each data class.',
  category: 'Data Science',
  icon: 'Archive',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'data',
      label: 'Data classes',
      type: 'textarea',
      placeholder: 'List data types, systems, and business purposes...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Requirements',
      type: 'textarea',
      placeholder: 'Describe legal, contractual, and product constraints...',
      required: false,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdictions',
      type: 'text',
      placeholder: 'e.g. India, EU, US',
      required: true,
    },
  ],
  systemPrompt: `You are a data governance lead.

Write a retention policy for the provided data classes, balancing legal requirements, product needs, and storage cost.

Output format:

## Data Classes
- Categories of data and where they live.
- Legal, contractual, and product drivers.
- Data with special handling requirements.

## Retention Schedule
- Retention period per class with justification.
- Trigger events such as account closure or contract end.
- Exceptions and legal holds.

## Deletion Mechanics
- Hard delete, soft delete, and anonymization.
- Backups, replicas, and derived datasets.
- Verification that deletion actually happened.

## Audit Evidence
- Records to keep and for how long.
- Owner and review cadence.
- Evidence for audits and customer requests.

Rules:
- Distinguish retention from backup rotation.
- Call out derived data and caches that may outlive the source.
- Do not give legal advice; flag items for counsel review.`,

  outputType: 'markdown',
}
