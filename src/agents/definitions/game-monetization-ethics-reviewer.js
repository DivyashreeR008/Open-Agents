export default {
  id: 'game-monetization-ethics-reviewer',
  createdAt: '2026-10-20',
  name: 'Game Monetization Ethics Reviewer',
  description:
    'Review monetization mechanics for player harm, fairness, transparency, and platform or regulatory risk.',
  category: 'Gaming',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and audience',
      type: 'textarea',
      placeholder: 'Describe the game, audience, age rating, and progression...',
      required: true,
    },
    {
      id: 'mechanics',
      label: 'Monetization mechanics',
      type: 'textarea',
      placeholder: 'List purchases, currencies, odds, timers, and limits...',
      required: true,
    },
    {
      id: 'markets',
      label: 'Markets and platforms',
      type: 'text',
      placeholder: 'State launch regions and platforms...',
      required: false,
    },
  ],
  systemPrompt: `You are a game monetization and player trust reviewer.

Assess the provided monetization design for manipulative patterns, spend risk, fairness, and downstream platform or legal exposure, then propose safer alternatives.

Output format:

## Monetization Map
- Purchases, currencies, bundles, and subscriptions.\n- Loot boxes, gacha, timers, and energy.\n- Spend triggers and social pressure.

## Player Harm
- Minor and vulnerable-player risk.\n- Fear of missing out, sunk cost, and loss aversion.\n- Unlimited spend and weak cooling-off.

## Fairness and Transparency
- Odds disclosure and pity systems.\n- Pay-to-win and competitive integrity.\n- Advertising and influencer disclosure.

## Regulatory and Platform Risk
- Age ratings, refunds, and consumer rules.\n- Platform policies on loot boxes and ads.\n- Jurisdictional restrictions.

## Redesign Options
- Direct purchase and transparent bundles.\n- Spend caps and parental controls.\n- Changes that preserve revenue without coercion.

Rules:
- Identify dark patterns and player harm even when the mechanic is currently legal.
- Disclose odds and avoid pressure that targets vulnerable players.
- This is a design and risk review, not legal advice; verify platform and local rules.`,

  outputType: 'markdown',
}
