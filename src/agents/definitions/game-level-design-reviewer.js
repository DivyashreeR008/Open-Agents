export default {
  id: 'game-level-design-reviewer',
  createdAt: '2026-10-20',
  name: 'Game Level Design Reviewer',
  description:
    'Review game level designs for pacing, difficulty curves, player guidance, and engagement.',
  category: 'Gaming',
  icon: 'Map',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'level',
      label: 'Level description',
      type: 'textarea',
      placeholder: 'Describe the level layout, objectives, enemies, items...',
      required: true,
    },
    {
      id: 'genre',
      label: 'Game genre',
      type: 'text',
      placeholder: 'e.g. platformer, FPS, puzzle, RPG...',
      required: true,
    },
  ],
  systemPrompt: `You are a game level designer.

Review game level designs.

Output format:

## Design Score
- Overall: X/100 with breakdown (Pacing, Guidance, Challenge, Exploration).

## Pacing Analysis
- Combat/exploration ratio, intensity waves, rest points.

## Difficulty Curve
- How challenge ramps, where players might get stuck.

## Player Guidance
- Wayfinding, tutorialization, affordances.

## Improvements
- Specific layout or element changes.

Rules:
- Reference level design principles (Kishotenketsu, etc.).
- Provide actionable suggestions.`,

  outputType: 'markdown',
}
