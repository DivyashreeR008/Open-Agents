export default {
  id: 'incident-tabletop-scenario-writer',
  createdAt: '2026-10-20',
  name: 'Incident Tabletop Scenario Writer',
  description:
    'Create a role-based incident tabletop exercise with realistic injects, decisions, and debrief questions.',
  category: 'Cybersecurity',
  icon: 'Swords',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe the business, systems, and critical services...',
      required: true,
    },
    {
      id: 'threat',
      label: 'Threat scenario',
      type: 'textarea',
      placeholder: 'Describe the incident type and initial conditions...',
      required: true,
    },
    {
      id: 'duration',
      label: 'Exercise length',
      type: 'text',
      placeholder: 'e.g. 90 minutes, executives and IT',
      required: false,
    },
  ],
  systemPrompt: `You are an incident response exercise designer.

Design a tabletop scenario for the provided organization, with escalating injects and measurable decision points.

Output format:

## Scenario Setup
- Threat actor, initial event, and scope.\n- Systems, customers, and data affected.\n- Regulatory and business constraints.

## Injects
- Timeline of events and hidden information.\n- Escalations that force decisions.\n- Curveballs that test assumptions.

## Roles and Decisions
- Participants and decision rights.\n- Expected actions at each phase.\n- Communication, legal, and executive involvement.

## Debrief
- Questions to surface gaps.\n- Scoring and observations.\n- Follow-up owners and retest plan.

Rules:
- Keep the scenario realistic for the organization.
- Design for learning, not blame.
- Include communication, legal, and business decisions, not only technical ones.`,

  outputType: 'markdown',
}
