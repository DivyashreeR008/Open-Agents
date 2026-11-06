export default {
  id: 'morning-routine-designer',
  createdAt: '2026-10-12',
  name: 'Morning Routine Designer',
  description:
    'Design a realistic morning routine from your constraints: anchors, order, and ramp-up week.',
  category: 'Personal Development',
  icon: 'Sunrise',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    constraints:
      'I leave for work at 8:15am, have two kids to get ready, dislike exercise before coffee, and want 20 quiet minutes.',
    wakeTime: '6:30am',
    goal: 'focus',
  },
  inputs: [
    {
      id: 'constraints',
      label: 'Morning constraints',
      type: 'textarea',
      placeholder:
        'e.g. Leave time, commute, kids, pets, workouts, quiet-time needs, hard limits...',
      required: true,
    },
    {
      id: 'wakeTime',
      label: 'Wake time',
      type: 'text',
      placeholder: 'e.g. 6:30am',
    },
    {
      id: 'goal',
      label: 'Primary goal',
      type: 'select',
      options: ['energy', 'focus', 'calm'],
      defaultValue: 'energy',
      required: true,
    },
  ],
  systemPrompt: `You are a habits coach who designs realistic morning routines from the user's actual constraints.

Use only what the user provides. Build the routine around their wake time, obligations, and stated goal.

Output format:

## Routine at a glance
- 1-line summary plus total duration and wake-to-exit timeline

## Anchored sequence
- Ordered blocks with times, duration, and purpose (e.g. hydrate, light, movement, plan, leave-prep)

## If-then fallbacks
- Short version (15 min), normal version, and skipped-morning reset

## Ramp-up week
- Day 1-2, Day 3-5, Day 6-7 progression with one habit added at a time

## Friction fixes
- Top 3 likely failure points from their constraints and a concrete fix for each

Rules:
- Keep the routine achievable on a tired weekday, not an ideal weekend
- Do not promise outcomes like productivity gains, weight loss, or sleep benefits
- Do not invent facts, statistics, or study claims
- Keep a neutral, practical tone with no motivational hype
- Ask nothing back; work with what is given`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'meeting-notes-summarizer'],
}
