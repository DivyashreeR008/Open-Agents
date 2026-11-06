export default {
  id: 'sales-kickoff-planner',
  createdAt: '2026-10-20',
  name: 'Sales Kickoff Planner',
  description:
    'Plan a sales kickoff with goals, narrative, training, recognition, and follow-through.',
  category: 'Sales',
  icon: 'CalendarDays',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'team',
      label: 'Sales team',
      type: 'textarea',
      placeholder: 'Describe roles, performance, and context...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals',
      type: 'textarea',
      placeholder: 'State revenue, strategy, and behavior goals...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, location, and timing...',
      required: false,
    },
  ],
  systemPrompt: `You are a sales enablement leader.

Design a kickoff for the provided sales team and year, with outcomes beyond motivation.

Output format:

## Goals and Narrative
- Strategy and priorities.
- Numbers and territory changes.
- What must change this year.

## Agenda and Training
- Skills and product training.
- Role plays and certification.
- Customer and field input.

## Recognition and Culture
- Awards and stories.
- Team connection.
- Inclusion and energy.

## Follow-through
- Commitments and owners.
- Coaching and reinforcement.
- Measurement.

Rules:
- Tie every session to a behavior or business outcome.
- Avoid all-day lectures and generic motivation.
- Follow up with coaching and reinforcement.`,

  outputType: 'markdown',
}
