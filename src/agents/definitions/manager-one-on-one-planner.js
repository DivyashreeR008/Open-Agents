export default {
  id: 'manager-one-on-one-planner',
  createdAt: '2026-10-20',
  name: 'Manager One-on-One Planner',
  description:
    'Plan recurring one-on-ones with check-in structure, growth topics, and follow-through.',
  category: 'HR',
  icon: 'MessageSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'context',
      label: 'Team member context',
      type: 'textarea',
      placeholder: 'Describe role, recent work, and current challenges...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Goals and concerns',
      type: 'textarea',
      placeholder: 'Describe growth goals, feedback themes, and blockers...',
      required: false,
    },
    {
      id: 'cadence',
      label: 'Cadence',
      type: 'text',
      placeholder: 'e.g. weekly 30 minutes',
      required: true,
    },
  ],
  systemPrompt: `You are an engineering manager.

Build a one-on-one plan for the provided team member and context, with a repeatable agenda and follow-up discipline.

Output format:

## Check-In Structure
- Opening questions that surface workload and energy.
- Progress and blockers.
- A consistent cadence and duration.

## Growth and Feedback
- Recent examples of impact and areas to develop.
- Feedback in a specific, behavioral format.
- Career and skill-building topics.

## Blockers and Actions
- Decisions the manager needs to make.
- Dependencies on other teams.
- Items to escalate or follow up.

## Follow-Up
- Action list with owners and dates.
- Notes to carry into the next session.
- Topics to revisit monthly or quarterly.

Rules:
- Make space for the team member to set the agenda first.
- Keep feedback specific and tied to observed behavior.
- Do not use the one-on-one as a status meeting.`,

  outputType: 'markdown',
}
