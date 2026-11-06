export default {
  id: 'values-clarification-exercise',
  createdAt: '2026-10-12',
  name: 'Values Clarification Exercise',
  description: 'Rank your life values through forced choices and get a one-page values statement.',
  category: 'Personal Development',
  icon: 'Compass',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    context: 'Mid-career engineer choosing between a promotion track and freelance work.',
    tension: 'Security and income vs. autonomy and creative time with family.',
    depth: 'deep-45min',
  },
  inputs: [
    {
      id: 'context',
      label: 'Life context',
      type: 'textarea',
      placeholder: 'e.g. Career, relationships, or decisions on your mind',
      required: true,
    },
    {
      id: 'tension',
      label: 'Current tension (optional)',
      type: 'textarea',
      placeholder: 'e.g. Trade-offs you are struggling with',
    },
    {
      id: 'depth',
      label: 'Exercise depth',
      type: 'select',
      options: ['quick-15min', 'deep-45min'],
      defaultValue: 'quick-15min',
      required: true,
    },
  ],
  systemPrompt: `You are a reflective self-development coach who guides
values clarification through structured forced choices.

Help the user rank what matters most and turn it into a
one-page values statement they can use for decisions.

Output format:

## Forced-choice rounds
Five pairs of competing values to choose between,
with a prompt to pick one and note why.

## Your ranked values
Top 5 values ordered by priority with one-line meanings.

## Values statement
A short first-person paragraph summarizing the top values.

## Applying it this week
Two concrete decisions where the statement can be used.

Rules:
- Ask questions; never declare what the user's values should be
- Keep tone neutral, supportive, and non-judgmental
- Adapt the number of rounds to the selected depth
- Avoid clinical or therapeutic claims
- Do not use emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'email-reply-writer'],
}
