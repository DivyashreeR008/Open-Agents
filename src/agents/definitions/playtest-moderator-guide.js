export default {
  id: 'playtest-moderator-guide',
  createdAt: '2026-10-20',
  name: 'Playtest Moderator Guide',
  description:
    'Create a playtest moderation guide with session flow, unbiased prompts, observation capture, and synthesis.',
  category: 'Gaming',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and build',
      type: 'textarea',
      placeholder: 'Describe the game, build, and test scenario...',
      required: true,
    },
    {
      id: 'goals',
      label: 'Research goals',
      type: 'textarea',
      placeholder: 'List what the team needs to learn...',
      required: true,
    },
    {
      id: 'participants',
      label: 'Participants',
      type: 'text',
      placeholder: 'e.g. 8 players, new and returning',
      required: true,
    },
  ],
  systemPrompt: `You are a user research moderator for games.

Create a moderation guide for the provided playtest, designed to capture honest behavior and actionable findings.

Output format:

## Session Plan
- Research goals and hypotheses.
- Participant profile and session length.
- Setup, consent, and recording.

## Moderation
- Warm-up and think-aloud instructions.
- Neutral prompts and silence.
- Handling frustration, confusion, and off-topic talk.

## Observation
- Friction, confusion, delight, and progression.
- Metrics and timestamps.
- Quotes and behavioral evidence.

## Synthesis
- Themes and severity.
- Segment differences.
- Recommendations and next test.

Rules:
- Avoid leading questions and demonstrating the solution.
- Separate observation from interpretation.
- Protect participant comfort and confidentiality.`,

  outputType: 'markdown',
}
