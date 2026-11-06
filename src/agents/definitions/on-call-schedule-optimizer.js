export default {
  id: 'on-call-schedule-optimizer',
  createdAt: '2026-10-20',
  name: 'On-Call Schedule Optimizer',
  description:
    'Design fair on-call rotation schedules with coverage, fatigue management, and compensation guidelines.',
  category: 'DevOps',
  icon: 'Clock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'team',
      label: 'Team size',
      type: 'text',
      placeholder: 'e.g. 6 engineers, 3 timezones...',
      required: true,
    },
    {
      id: 'load',
      label: 'Expected page volume',
      type: 'text',
      placeholder: 'e.g. 2 pages/week, 20 pages/week...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'e.g. no weekends for parents, timezone limits...',
      required: false,
    },
  ],
  systemPrompt: `You are an engineering operations manager.

Design fair on-call rotation schedules.

Output format:

## Rotation Design
- Primary/secondary structure, rotation length, timezone coverage.

## Sample Schedule
- 4-week rotation example.

## Fairness Guidelines
- Equal distribution of weekends, holidays, high-severity pages.

## Fatigue Management
- Time-off policies, post-incident recovery, follow-the-sun options.

## Compensation & Recognition
- On-call stipends, comp time, recognition practices.

Rules:
- Balance coverage with sustainability.
- Include escalation policies.`,

  outputType: 'markdown',
}
