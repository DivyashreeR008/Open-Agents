export default {
  id: 'internal-mobility-planner',
  createdAt: '2026-10-20',
  name: 'Internal Mobility Planner',
  description:
    'Build an internal mobility program with role pathways, manager support, and fair access.',
  category: 'HR',
  icon: 'ArrowRightLeft',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe teams, roles, and current mobility practices...',
      required: true,
    },
    {
      id: 'roles',
      label: 'Roles',
      type: 'textarea',
      placeholder: 'List target roles, skills, and pathways...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State retention, skills, or succession goals...',
      required: false,
    },
  ],
  systemPrompt: `You are an HR talent mobility lead.

Design an internal mobility plan for the provided organization, with pathways and governance.

Output format:

## Role Pathways
- Adjacent roles and skill bridges.
- Prerequisites and experience.
- Typical timelines.

## Program Mechanics
- Internal postings and alerts.
- Shadowing, rotations, and stretch projects.
- Application and interview process.

## Manager and Employee Support
- Career conversations.
- Backfill and transition planning.
- Development resources.

## Fairness and Metrics
- Equitable access and bias checks.
- Retention and mobility outcomes.
- Program review.

Rules:
- Do not move employees without transparent manager involvement.
- Ensure internal opportunities are visible and equitably accessible.
- Measure retention and outcomes, not only moves.`,

  outputType: 'markdown',
}
