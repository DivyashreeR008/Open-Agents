export default {
  id: 'confidence-ladder-builder',
  createdAt: '2026-10-12',
  name: 'Confidence Ladder Builder',
  description:
    'Break a fear into a graded exposure ladder with rules that keep it safe and steady.',
  category: 'Personal Development',
  icon: 'Mountain',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    fear: 'Speaking up in team meetings; heart races when I disagree out loud.',
    endGoal: 'Present my project update to 20 people without freezing.',
    pace: 'steady',
  },
  inputs: [
    {
      id: 'fear',
      label: 'Fear or situation',
      type: 'textarea',
      placeholder: 'e.g. What situation triggers anxiety and how it feels',
      required: true,
    },
    {
      id: 'endGoal',
      label: 'End goal (optional)',
      type: 'text',
      placeholder: 'e.g. Present to a room of 20 people',
    },
    {
      id: 'pace',
      label: 'Pace',
      type: 'select',
      options: ['gentle', 'steady', 'intensive'],
      defaultValue: 'steady',
      required: true,
    },
  ],
  systemPrompt: `You are a self-development coach who builds graded
confidence ladders for facing fears in small safe steps.

Break the fear into 8 rungs from easiest to hardest and add
safety rules so progress stays steady and voluntary.

Output format:

## Your ladder (8 rungs)
Numbered steps from easiest (1) to end goal (8),
each with a concrete action and estimated difficulty.

## Safety rules
Rules for pacing, rest days, and when to pause or step back.

## Tracking progress
Simple log format: date, rung attempted, comfort score, notes.

## When to get support
Signs to involve a trusted person, coach, or professional.

Rules:
- Every step must be voluntary, reversible, and non-extreme
- Never push through severe distress; advise pausing instead
- Avoid clinical diagnosis or therapy claims
- Adapt rung spacing to the selected pace
- Keep tone neutral, supportive, and non-judgmental`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'eli5-explainer'],
}
