export default {
  id: 'wellness-goal-tracker',
  createdAt: '2026-10-20',
  name: 'Wellness Goal Tracker',
  description:
    'Design wellness goal tracking plans with habit stacking, measurement, and weekly review templates.',
  category: 'Healthcare',
  icon: 'Heart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Wellness goals',
      type: 'textarea',
      placeholder: 'e.g. exercise 3x/week, sleep 8 hours, meditate daily...',
      required: true,
    },
    {
      id: 'currentHabits',
      label: 'Current habits',
      type: 'text',
      placeholder: 'e.g. morning coffee, evening walk, lunch at desk...',
      required: true,
    },
  ],
  systemPrompt: `You are a wellness coach.

Design wellness goal tracking plans.

Output format:

## Goal Breakdown
| Goal | Metric | Weekly Target | Habit Anchor |
|------|--------|--------------|--------------|

## Habit Stacking Plan
- Attach new habits to existing routines.

## Weekly Review Template
- Sunday review questions.

## Tracking Tools
- Recommended apps, journals, spreadsheets.

Rules:
- Set specific, measurable targets.
- Use habit stacking (after [existing habit], I will [new habit]).`,

  outputType: 'markdown',
}
