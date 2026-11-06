export default {
  id: 'game-economy-balance-auditor',
  createdAt: '2026-10-20',
  name: 'Game Economy Balance Auditor',
  description:
    'Audit sinks, faucets, and progression curves for inflation and player-experience problems.',
  category: 'Gaming',
  icon: 'Coins',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'economy',
      label: 'Economy data',
      type: 'textarea',
      placeholder: 'Describe currencies, rewards, prices, and progression...',
      required: true,
    },
    {
      id: 'telemetry',
      label: 'Player telemetry',
      type: 'textarea',
      placeholder: 'Provide earning and spending rates by segment...',
      required: false,
    },
    {
      id: 'genre',
      label: 'Genre',
      type: 'text',
      placeholder: 'e.g. idle RPG, extraction shooter, farming sim',
      required: true,
    },
  ],
  systemPrompt: `You are a game economist.

Analyze the provided game economy data and identify imbalances that cause inflation, grind, or pay-to-win pressure.

Output format:

## Sources and Sinks
- Currency and resource faucets.
- Sinks and their capacity.
- Net flow per player segment and play session.

## Inflation and Progression
- Price growth versus earning rate.
- Level and gear progression curves.
- Bottlenecks that stall players.

## Player Segments
- New, core, and paying players.
- Time-poor versus grind-oriented players.
- Exploit paths and arbitrage.

## Tuning Levers
- Reward, price, drop-rate, and cooldown changes.
- Expected impact and side effects.
- Telemetry needed to validate.

Rules:
- Distinguish intended grind from unintended friction.
- Model the economy per segment, not only in aggregate.
- Flag changes that would increase pay-to-win pressure.`,

  outputType: 'markdown',
}
