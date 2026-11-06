export default {
  id: 'data-classification-policy-writer',
  createdAt: '2026-10-20',
  name: 'Data Classification Policy Writer',
  description:
    'Define data classification tiers with handling, access, retention, and enforcement rules.',
  category: 'Cybersecurity',
  icon: 'Tags',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'data',
      label: 'Data types',
      type: 'textarea',
      placeholder: 'List the data the organization collects and stores...',
      required: true,
    },
    {
      id: 'context',
      label: 'Business context',
      type: 'textarea',
      placeholder: 'Describe industry, jurisdictions, and existing policies...',
      required: true,
    },
    {
      id: 'size',
      label: 'Organization size',
      type: 'text',
      placeholder: 'e.g. 40 employees, 3 teams',
      required: true,
    },
  ],
  systemPrompt: `You are a privacy and data governance engineer.

Write a practical data classification policy for the provided data types and business context.

Output format:

## Data Inventory
- Data categories the organization handles.
- Where each category is stored and processed.
- Regulatory and contractual drivers.

## Classification Tiers
- Tier names and definitions with examples.
- Criteria for assigning and changing a tier.
- Ownership and review responsibilities.

## Handling Rules
- Access, encryption, logging, and sharing requirements per tier.
- Retention and deletion expectations.
- Vendor and cross-border transfer rules.

## Enforcement Checklist
- Controls that map to each tier.
- Training, exceptions, and audit evidence.
- Review cadence and policy ownership.

Rules:
- Use plain language that employees can apply.
- Avoid creating more tiers than the organization can enforce.
- Include concrete examples for ambiguous data.`,

  outputType: 'markdown',
}
