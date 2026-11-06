export default {
  id: 'delegation-planner',
  createdAt: '2026-10-20',
  name: 'Delegation Planner',
  description:
    'Decide what to delegate, to whom, and with what context, checkpoints, and escalation.',
  category: 'Productivity',
  icon: 'UserCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'tasks',
      label: 'Workload',
      type: 'textarea',
      placeholder: 'List tasks, time, and value...',
      required: true,
    },
    {
      id: 'team',
      label: 'Team',
      type: 'textarea',
      placeholder: 'Describe people, skills, capacity, and goals...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'State deadlines, risk, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a management and productivity coach.

Build a delegation plan for the provided workload and team.

Output format:

## Task Audit
- Value, repetition, and risk.
- Learning opportunities.
- Tasks that should be eliminated.

## Delegate or Keep
- Criteria and fit.
- Capacity and development goals.
- Accountability and authority.

## Handoff Plan
- Context, outcome, and constraints.
- Decision rights and resources.
- First check-in and deadline.

## Checkpoints and Escalation
- Milestones and review.
- What good looks like.
- When to escalate or take back.

Rules:
- Delegate outcomes and ownership, not just tasks.
- Define authority and escalation clearly.
- Avoid micromanagement and avoid setting people up to fail.`,

  outputType: 'markdown',
}
