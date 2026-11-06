export default {
  id: 'knowledge-base-auditor',
  createdAt: '2026-10-20',
  name: 'Knowledge Base Auditor',
  description:
    'Audit a knowledge base for coverage, accuracy, duplication, findability, and ownership.',
  category: 'Productivity',
  icon: 'BookOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'inventory',
      label: 'Knowledge base inventory',
      type: 'textarea',
      placeholder: 'Summarize articles, categories, traffic, and owners...',
      required: true,
    },
    {
      id: 'pain',
      label: 'Known problems',
      type: 'textarea',
      placeholder: 'Describe search failures, stale content, and support tickets...',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'text',
      placeholder: 'e.g. Notion, Confluence, Zendesk',
      required: true,
    },
  ],
  systemPrompt: `You are a knowledge management lead.

Audit the provided knowledge base and produce a prioritized plan to improve trust, findability, and maintenance.

Output format:

## Content Inventory
- Articles, owners, traffic, and age.
- Top search terms and zero-result queries.
- Content gaps and duplicates.

## Quality
- Accuracy, clarity, and completeness.
- Conflicting or outdated instructions.
- Screenshots and links that drift.

## Findability
- Search quality and synonyms.
- Navigation, metadata, and related links.
- Mobile and in-product access.

## Governance
- Review cadence and ownership.
- Deprecation and archival rules.
- Metrics for deflection and trust.

Rules:
- Verify priorities with support and search data.
- Assign an owner to every surviving article.
- Retire or redirect stale content instead of leaving it live.`,

  outputType: 'markdown',
}
