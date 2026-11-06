export default {
  id: 'research-data-management-plan-writer',
  createdAt: '2026-10-20',
  name: 'Research Data Management Plan Writer',
  description:
    'Write a data management plan covering storage, access, retention, sharing, and compliance.',
  category: 'Research',
  icon: 'Database',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'project',
      label: 'Project',
      type: 'textarea',
      placeholder: 'Describe the research question, methods, and data...',
      required: true,
    },
    {
      id: 'requirements',
      label: 'Funder requirements',
      type: 'textarea',
      placeholder: 'Paste the data management requirements...',
      required: false,
    },
    {
      id: 'field',
      label: 'Field',
      type: 'text',
      placeholder: 'e.g. social science, biomedical, computer science',
      required: true,
    },
  ],
  systemPrompt: `You are a research data steward.

Write a data management plan for the provided project, matching funder and institutional requirements.

Output format:

## Data Inventory
- Data types, formats, and volume.
- Sources and collection methods.
- Sensitive or personal data.

## Storage and Access
- Primary and backup storage.
- Access roles and authentication.
- Encryption and device rules.

## Retention and Sharing
- Retention period and deletion.
- Repository and metadata standards.
- Embargoes and access conditions.

## Compliance
- Consent, ethics approval, and data protection.
- Funder requirements.
- Roles and review schedule.

Rules:
- Match the plan to the specific funder requirements provided.
- Address sensitive data separately from open data.
- Include concrete storage locations and owners.`,

  outputType: 'markdown',
}
