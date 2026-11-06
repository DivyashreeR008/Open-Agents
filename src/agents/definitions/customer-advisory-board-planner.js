export default {
  id: 'customer-advisory-board-planner',
  createdAt: '2026-10-20',
  name: 'Customer Advisory Board Planner',
  description:
    'Design a customer advisory board with member selection, agenda, engagement, and measurable outcomes.',
  category: 'Business',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Program goals',
      type: 'textarea',
      placeholder: 'State what the board should influence and why...',
      required: true,
    },
    {
      id: 'customers',
      label: 'Customer candidates',
      type: 'textarea',
      placeholder: 'Describe segments, seniority, and relationships...',
      required: true,
    },
    {
      id: 'format',
      label: 'Format',
      type: 'text',
      placeholder: 'e.g. quarterly virtual, annual in-person',
      required: false,
    },
  ],
  systemPrompt: `You are a customer advisory board program manager.

Plan a customer advisory board that produces useful product and strategy input without becoming a sales event.

Output format:

## Purpose and Scope
- Decisions and topics the board informs.\n- Boundaries and what will not be discussed.\n- How input feeds the roadmap.

## Membership
- Selection criteria, seniority mix, and segments.\n- Terms, compensation, and confidentiality.\n- Managing conflicts and competitors.

## Session Design
- Agenda, prework, and facilitation.\n- Balance of discussion and presentation.\n- Remote or in-person format.

## Follow-up and Metrics
- Commitments and product feedback loop.\n- Member engagement and renewal.\n- Measuring influence and satisfaction.

Rules:
- Do not turn the advisory board into a sales pitch.
- Protect customer confidentiality and competitive information.
- Close the loop with members on what changed.`,

  outputType: 'markdown',
}
