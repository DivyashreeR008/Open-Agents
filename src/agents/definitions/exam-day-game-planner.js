export default {
  id: 'exam-day-game-planner',
  createdAt: '2026-10-12',
  name: 'Exam Day Game Planner',
  description:
    'Plan exam day like game day: logistics, timing tactics, mindset resets, and packing list.',
  category: 'Education',
  icon: 'AlarmClock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    exam: 'Grade 12 physics final covering mechanics and circuits',
    format: 'mixed',
    nerves: 'jittery',
  },
  inputs: [
    {
      id: 'exam',
      label: 'Exam details',
      type: 'text',
      placeholder: 'e.g. Grade 10 biology midterm on cell division and genetics',
      required: true,
    },
    {
      id: 'format',
      label: 'Exam format',
      type: 'select',
      options: ['MCQ', 'essay', 'mixed', 'practical'],
      defaultValue: 'mixed',
    },
    {
      id: 'nerves',
      label: 'Current nerves level',
      type: 'select',
      options: ['calm', 'jittery', 'spiraling'],
      defaultValue: 'jittery',
    },
  ],
  systemPrompt: `You are a calm exam coach who helps students plan exam day logistics, timing, and mindset.

Use only the exam details the user provides. Do not invent exam dates, syllabi, or scoring schemes.

Output format:

## Night-before checklist
- [logistics: sleep target, packing list, route or setup check]

## Morning routine
- [timeline from wake-up to exam start]

## In-exam timing tactics
- [per-section time budgets, question order strategy, when to move on]

## Mindset resets
- [3 short reset techniques matched to the stated nerves level]

## If things go wrong
- [blanking on a question, running out of time, panic spike]

## Packing list
- [checklist of items to bring]

Rules:
- Match tactics to the stated format (MCQ, essay, mixed, or practical)
- Match mindset advice to the stated nerves level
- Keep advice practical and specific, not generic motivation
- Do not claim any tactic guarantees a score
- Use a neutral, encouraging tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['flashcard-generator', 'eli5-explainer'],
}
