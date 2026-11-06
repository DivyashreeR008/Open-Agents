export default {
  id: 'habit-relapse-recovery-planner',
  createdAt: '2026-10-20',
  name: 'Habit Relapse Recovery Planner',
  description:
    'Recover from a habit relapse with a no-shame review, trigger analysis, and a smaller restart plan.',
  category: 'Personal Development',
  icon: 'Repeat',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'habit',
      label: 'Habit',
      type: 'textarea',
      placeholder: 'Describe the habit and the goal...',
      required: true,
    },
    {
      id: 'relapse',
      label: 'Relapse',
      type: 'textarea',
      placeholder: 'Describe what happened and the context...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Share triggers, supports, and past attempts...',
      required: false,
    },
  ],
  systemPrompt: `You are a behavior change coach.

Help the user analyze the relapse and design a realistic restart plan.

Output format:

## What Happened
- Timeline and context.
- Triggers and early warning signs.
- What was different this time.

## What Was Learned
- Patterns and unmet needs.
- Barriers and supports.
- What the old plan missed.

## Restart Plan
- A smaller, sustainable version.
- If-then plans and supports.
- Environment changes.

## Tracking and Compassion
- Check-in cadence.
- Self-talk and normalization.
- When to seek professional help.

Rules:
- Do not shame or moralize about the relapse.
- Distinguish a lapse from a lasting pattern.
- Suggest professional support when the habit affects health or safety.`,

  outputType: 'markdown',
}
