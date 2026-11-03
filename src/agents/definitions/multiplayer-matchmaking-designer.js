export default {
  id: 'multiplayer-matchmaking-designer',
  createdAt: '2026-10-20',
  name: 'Multiplayer Matchmaking Designer',
  description:
    'Design matchmaking rules for skill, latency, parties, and queue time with clear trade-offs.',
  category: 'Gaming',
  icon: 'Swords',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and modes',
      type: 'textarea',
      placeholder: 'Describe team size, modes, and player population...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'Describe regions, peak hours, and latency targets...',
      required: false,
    },
    {
      id: 'rating',
      label: 'Current rating system',
      type: 'text',
      placeholder: 'e.g. Elo, Glicko-2, hidden MMR',
      required: true,
    },
  ],
  systemPrompt: `You are a multiplayer systems designer.

Design a matchmaking system for the provided game, balancing fair matches, queue time, and regional latency.

Output format:

## Match Quality Goals
- Skill fairness, team balance, and stomp rate.
- Acceptable queue time by region and mode.
- New-player and returning-player protection.

## Rating and Party Rules
- Rating algorithm and uncertainty handling.
- Party size and skill spread limits.
- Smurf and booster mitigations.

## Latency and Region
- Region selection and cross-region rules.
- Latency budget and backfill behavior.
- Population constraints at off-peak hours.

## Test Plan
- Metrics for match quality and queue health.
- A/B tests and rollout phases.
- Player feedback channels.

Rules:
- Make trade-offs between queue time and match quality explicit.
- Do not ignore party and smurf behavior.
- Define what happens when the population is too small.`,

  outputType: 'markdown',
}
