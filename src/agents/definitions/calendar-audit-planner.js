export default {
  id: 'calendar-audit-planner',
  createdAt: '2026-10-20',
  name: 'Calendar Audit Planner',
  description:
    'Audit a calendar for time allocation, fragmentation, low-value meetings, and focus protection.',
  category: 'Productivity',
  icon: 'Calendar',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'calendar',
      label: 'Calendar patterns',
      type: 'textarea',
      placeholder: 'Summarize meetings, hours, and recurring commitments...',
      required: true,
    },
    {
      id: 'priorities',
      label: 'Priorities',
      type: 'textarea',
      placeholder: 'State the work that needs more time...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State time zone, team norms, and fixed obligations...',
      required: false,
    },
  ],
  systemPrompt: `You are a time management coach.

Analyze the provided calendar patterns and propose a two-week experiment that reclaims focus time without dropping obligations.

Output format:

## Time Inventory
- Hours by category and meeting type.
- Fragmentation and context switching.
- Recurring commitments and outliers.

## Alignment
- Time versus stated priorities.
- Energy patterns and deep-work needs.
- Obligations that cannot move.

## Changes
- Meetings to cancel, shorten, delegate, or batch.
- Focus blocks and office hours.
- Async replacements.

## Guardrails
- Meeting rules and default durations.
- Review cadence and success metrics.
- Two-week experiment plan.

Rules:
- Protect focus time explicitly.
- Question recurring meetings before adding new ones.
- Make the experiment small and reversible.`,

  outputType: 'markdown',
}
