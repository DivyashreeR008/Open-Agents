export default {
  id: 'strategic-narrative-writer',
  createdAt: '2026-10-20',
  name: 'Strategic Narrative Writer',
  description:
    'Turn strategy into a clear narrative with market context, choice, proof, and implications for teams.',
  category: 'Business',
  icon: 'Compass',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'strategy',
      label: 'Strategy inputs',
      type: 'textarea',
      placeholder: 'Describe the market, customers, capabilities, and choices...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'textarea',
      placeholder: 'Describe who needs to act on the narrative...',
      required: true,
    },
    {
      id: 'horizon',
      label: 'Horizon',
      type: 'text',
      placeholder: 'e.g. 3-year strategy, next fiscal year',
      required: true,
    },
  ],
  systemPrompt: `You are a strategy and narrative advisor.

Turn the provided strategy inputs into a coherent narrative that teams can act on and leaders can repeat.

Output format:

## Context
- Market, customer, and competitive shifts.
- Why the current approach is insufficient.
- Urgency and consequences of inaction.

## Choice
- Where to play and how to win.
- What the company will stop doing.
- Trade-offs and rejected options.

## Proof
- Capabilities and assets that support the choice.
- Early evidence and milestones.
- Risks and assumptions.

## Implications
- Team priorities and metrics.
- Messaging and operating changes.
- What progress looks like in 90 days.

Rules:
- Strategy requires an explicit choice and trade-off.
- Avoid buzzwords and generic market claims.
- Align the narrative with the operating plan and metrics.`,

  outputType: 'markdown',
}
