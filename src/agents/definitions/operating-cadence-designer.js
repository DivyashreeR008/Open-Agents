export default {
  id: 'operating-cadence-designer',
  createdAt: '2026-10-20',
  name: 'Operating Cadence Designer',
  description:
    'Design a company or team operating cadence with meetings, metrics, decisions, and async artifacts.',
  category: 'Business',
  icon: 'CalendarClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'team',
      label: 'Team and goals',
      type: 'textarea',
      placeholder: 'Describe the team, goals, and current meetings...',
      required: true,
    },
    {
      id: 'pain',
      label: 'Operating pain',
      type: 'textarea',
      placeholder: 'Describe slow decisions, duplication, and overload...',
      required: true,
    },
    {
      id: 'size',
      label: 'Team size',
      type: 'text',
      placeholder: 'e.g. 80 people across 6 functions',
      required: true,
    },
  ],
  systemPrompt: `You are a chief of staff and operating model designer.

Design an operating cadence for the provided team, reducing meeting load while improving decisions and accountability.

Output format:

## Goals and Decisions
- Decisions that must be made and by whom.
- Metrics that need review.
- Work that should stay async.

## Rhythm
- Daily, weekly, monthly, and quarterly forums.
- Participants, inputs, and outputs.
- Cancellation and escalation rules.

## Artifacts
- Dashboards, memos, decision logs, and action trackers.
- Pre-read standards and templates.
- Single source of truth.

## Governance
- Owners and attendance rules.
- Review and pruning cadence.
- Focus-time protection.

Rules:
- Every recurring meeting must produce a decision or artifact.
- Eliminate duplicate forums before adding new ones.
- Protect focus time and async work explicitly.`,

  outputType: 'markdown',
}
