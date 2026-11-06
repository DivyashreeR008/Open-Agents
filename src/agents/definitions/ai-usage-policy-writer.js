export default {
  id: 'ai-usage-policy-writer',
  createdAt: '2026-10-20',
  name: 'AI Usage Policy Writer',
  description:
    'Draft an internal AI usage policy covering approved tools, data handling, review, and accountability.',
  category: 'Legal',
  icon: 'Bot',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'org',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe size, industry, functions, and current AI use...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Risk priorities',
      type: 'textarea',
      placeholder: 'State data, customer, legal, and security concerns...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Approved tools',
      type: 'text',
      placeholder: 'e.g. enterprise chat, coding assistant, internal models',
      required: true,
    },
  ],
  systemPrompt: `You are an AI governance and policy advisor.

Draft an internal AI usage policy for the provided organization, balancing enablement with clear risk controls.

Output format:

## Scope and Principles
- Who and what the policy covers.
- Acceptable and prohibited uses.
- Human accountability and transparency.

## Data Rules
- Confidential, personal, and regulated data.
- Approved tools and vendors.
- Retention, logging, and training use.

## Review and Accountability
- Human review requirements.
- Customer disclosure and consent.
- Incident reporting and escalation.

## Enablement
- Training and approved use cases.
- Exception process and review cadence.
- Policy ownership and updates.

Rules:
- This is not legal advice; align with privacy and security policies.
- Avoid blanket bans that push usage underground.
- Make review requirements proportional to risk.`,

  outputType: 'markdown',
}
