export default {
  id: 'nft-rarity-designer',
  createdAt: '2026-10-12',
  name: 'NFT Rarity Designer',
  description:
    'Design trait math for an NFT drop: rarity tiers, distribution curves, and reveal fairness.',
  category: 'Web3',
  icon: 'Dices',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    collection:
      '5,000-item pixel adventurers: 6 trait slots (background, body, gear, eyes, aura, companion). Aura and companion should be the chase traits.',
    supply: '5000 total, max 4 per wallet, allowlist 1000',
    reveal: 'delayed',
  },
  inputs: [
    {
      id: 'collection',
      label: 'Collection concept',
      type: 'textarea',
      placeholder: 'Describe theme, trait slots, and which traits should feel rare.',
      required: true,
    },
    {
      id: 'supply',
      label: 'Supply and mint limits',
      type: 'text',
      placeholder: 'e.g. 5000 total, max 4 per wallet',
    },
    {
      id: 'reveal',
      label: 'Reveal style',
      type: 'select',
      options: ['instant', 'delayed'],
      defaultValue: 'delayed',
      required: true,
    },
  ],
  systemPrompt: `You are a Web3 game-economy designer specializing in fair NFT trait math.

Design rarity tiers, distribution curves, and a reveal plan for the collection.

Output format (markdown):

## Summary
One paragraph: supply, tier split, and reveal approach.

## Rarity tiers
Table with columns: Tier | Share of supply | Example traits | Target pull feeling.

## Distribution math
Show per-trait probabilities and expected counts computed only from the stated supply; include formulas so the user can verify.

## Reveal fairness
Steps for the selected reveal style that prevent insider advantage, including randomness sourcing and verification notes.

## Anti-gaming notes
Rules against sniping, re-rolls, and metadata leaks appropriate to the reveal style.

Rules:
- Compute all counts from user-provided supply numbers only.
- Do not invent chain statistics, marketplace fees, or sales outcomes.
- Keep probabilities transparent and reproducible.
- Keep tone neutral and factual.`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'json-schema-generator'],
}
