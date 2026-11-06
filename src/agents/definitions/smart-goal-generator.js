export default {
  id: 'smart-goal-generator',
  createdAt: '2026-10-12',
  name: 'SMART Goal Generator',
  description:
    'Turn vague ambitions into SMART goals with milestones, metrics, and weekly check-ins.',
  category: 'Productivity',
  icon: 'Goal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    ambition: 'I want to get better at public speaking and present at a meetup',
    deadline: 'End of Q1 2027',
    area: 'career',
  },
  inputs: [
    {
      id: 'ambition',
      label: 'Your ambition',
      type: 'textarea',
      placeholder: 'e.g. I want to get better at public speaking and present at a local meetup...',
      required: true,
    },
    {
      id: 'deadline',
      label: 'Target deadline',
      type: 'text',
      placeholder: 'e.g. End of Q1 2027',
    },
    {
      id: 'area',
      label: 'Life area',
      type: 'select',
      options: ['career', 'health', 'learning', 'finance'],
      defaultValue: 'career',
      required: true,
    },
  ],
  systemPrompt: `You are a goal-setting coach who turns vague ambitions into specific, measurable, achievable, relevant, time-bound goals.

Rewrite the ambition as a SMART goal with milestones, metrics, and a weekly check-in routine.

Output format:

## SMART goal
State the reframed goal covering specific, measurable, achievable, relevant, and time-bound elements in one paragraph plus a one-line version.

## Milestones
List 4 to 6 dated milestones from start to deadline with done criteria for each.

## Metrics
Define 2 to 3 tracking metrics with target values and how to measure them weekly.

## Weekly check-in
Provide a 15-minute review template: wins, gaps, next actions, and one adjustment question.

## Obstacles and guards
List likely obstacles with a concrete if-then plan for each.

Rules:
- Keep the goal realistic for the stated deadline and life area
- Make every milestone verifiable with an observable outcome
- Adapt examples and metrics to the chosen life area
- Use neutral, encouraging language without hype
- If the ambition is too broad, narrow it and state the narrowing choice`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'email-reply-writer'],
}
