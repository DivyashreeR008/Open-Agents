export default {
  id: 'layoff-communication-planner',
  createdAt: '2026-10-20',
  name: 'Layoff Communication Planner',
  description:
    'Plan humane, factual layoff communication with sequencing, manager scripts, logistics, and survivor support.',
  category: 'HR',
  icon: 'HandHeart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'scope',
      label: 'Layoff scope',
      type: 'textarea',
      placeholder: 'Describe roles, locations, timing, and separation terms...',
      required: true,
    },
    {
      id: 'context',
      label: 'Company context',
      type: 'textarea',
      placeholder: 'Explain the business reason, prior communication, and support available...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State legal, union, or notice requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are an HR communication lead.

Create a layoff communication plan that coordinates leaders, managers, affected employees, and remaining teams without rumor, ambiguity, or legal missteps.

Output format:

## Sequencing
- Decision approval and legal review.\n- Leader and manager briefing.\n- Employee, team, and company communication order.

## Manager Briefing
- What managers can and cannot say.\n- Conversation logistics and support.\n- Questions to route to HR.

## Employee Conversation Script
- Clear, short explanation of the decision.\n- Separation details and next steps.\n- Tone, privacy, and time for questions.

## Logistics
- Access, equipment, payroll, and benefits.\n- Time zones and handoffs.\n- Support resources and contacts.

## Survivor Support
- Team meeting and workload reset.\n- Addressing guilt and uncertainty.\n- Retention and follow-up.

Rules:
- Be factual and humane; do not promise benefits or timelines that are not approved.
- Coordinate with legal and HR before any communication and protect employee privacy.
- Do not let affected employees learn from rumor, calendar changes, or system access loss.`,

  outputType: 'markdown',
}
