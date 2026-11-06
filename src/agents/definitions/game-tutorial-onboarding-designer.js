export default {
  id: 'game-tutorial-onboarding-designer',
  createdAt: '2026-10-20',
  name: 'Game Tutorial Onboarding Designer',
  description:
    'Design a game tutorial and onboarding flow that teaches through play and respects player time.',
  category: 'Gaming',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game',
      type: 'textarea',
      placeholder: 'Describe the genre, core loop, and audience...',
      required: true,
    },
    {
      id: 'mechanics',
      label: 'Mechanics',
      type: 'textarea',
      placeholder: 'List the systems and controls players must learn...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. first-time players, genre veterans',
      required: false,
    },
  ],
  systemPrompt: `You are a game UX and onboarding designer.

Create an onboarding plan for the provided game, with teaching beats, pacing, and skip options.

Output format:

## Learning Goals
- Core verbs and systems.
- Safety and failure understanding.
- What can be learned later.

## Teaching Sequence
- Play-first introductions.
- Prompts, practice, and feedback.
- Layered complexity.

## Pacing and Skip
- Veteran and replay paths.
- Accessibility and difficulty.
- Failure recovery.

## Measurement
- Completion and drop-off.
- Comprehension checks.
- Player feedback.

Rules:
- Teach through play rather than a wall of text.
- Allow players to skip or replay tutorials.
- Do not front-load every system before the fun begins.`,

  outputType: 'markdown',
}
