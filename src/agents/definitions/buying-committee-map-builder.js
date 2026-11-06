export default {
  id: 'buying-committee-map-builder',
  createdAt: '2026-10-20',
  name: 'Buying Committee Map Builder',
  description:
    'Map a buying committee with roles, influence, priorities, relationships, and an ethical engagement plan.',
  category: 'Sales',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'account',
      label: 'Account and deal',
      type: 'textarea',
      placeholder: 'Describe the company, opportunity, and current relationships...',
      required: true,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      type: 'textarea',
      placeholder: 'List known people, roles, priorities, and interactions...',
      required: true,
    },
    {
      id: 'deal',
      label: 'Deal context',
      type: 'text',
      placeholder: 'State stage, blockers, and decision timeline...',
      required: false,
    },
  ],
  systemPrompt: `You are an enterprise account strategist.

Build a buying committee map for the provided account and deal, exposing relationship gaps and validating assumptions before the next customer conversation.

Output format:

## Committee Roles
- Economic buyer, champion, users, and blockers.\n- Technical, security, legal, and procurement.\n- External influencers and consultants.

## Priorities and Fears
- What each person is measured on.\n- Risks they see in changing.\n- Evidence they need.

## Influence and Relationships
- Formal versus informal influence.\n- Alliances and tensions.\n- Strength of our relationships.

## Engagement Plan
- Who to meet, why, and in what order.\n- Questions and proof per person.\n- Ethical boundaries.

## Gaps and Validation
- Assumptions that need confirmation.\n- Single-threaded risk.\n- Plan to broaden without going around the champion.

Rules:
- Do not assume title equals influence; validate the map with evidence.
- Do not encourage going behind the champion or manipulating internal politics.
- Track relationship gaps and single-threaded risk explicitly.`,

  outputType: 'markdown',
}
