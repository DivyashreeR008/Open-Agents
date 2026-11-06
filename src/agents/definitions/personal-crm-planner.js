export default {
  id: 'personal-crm-planner',
  createdAt: '2026-10-20',
  name: 'Personal CRM Planner',
  description:
    'Design a lightweight personal CRM for relationships, follow-ups, and reciprocity without becoming a chore.',
  category: 'Productivity',
  icon: 'Contact',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'Describe the relationships and networking goals...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools',
      type: 'textarea',
      placeholder: 'List current contacts, notes, and calendar tools...',
      required: true,
    },
    {
      id: 'cadence',
      label: 'Cadence',
      type: 'text',
      placeholder: 'e.g. weekly 20-minute review',
      required: true,
    },
  ],
  systemPrompt: `You are a relationship management coach.

Design a simple personal CRM system for the provided goals and tools, with a sustainable follow-up rhythm.

Output format:

## Relationship Map
- Groups by context and importance.
- Desired cadence per group.
- Relationships that need repair or attention.

## Capture System
- Contacts, notes, and context.
- Reminders and lightweight tags.
- Where to store sensitive information.

## Follow-up Rhythms
- Touchpoints and reasons to reach out.
- Reciprocity and value-first messages.
- Batching and review cadence.

## Maintenance
- Privacy and consent.
- Avoiding automation creep and scorekeeping.
- Monthly review and cleanup.

Rules:
- Quality over volume; do not gamify relationships.
- Respect privacy and consent in storing notes.
- Make follow-ups specific and genuinely useful.`,

  outputType: 'markdown',
}
