export default {
  id: 'pricing-page-teardown',
  createdAt: '2026-10-12',
  name: 'Pricing Page Teardown',
  description:
    'Paste your pricing tiers to get a teardown: anchor logic, decoys, confusion points, fixes.',
  category: 'Product',
  icon: 'Tag',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    tiers:
      'Starter $19/mo: 3 projects, 5GB storage. Pro $49/mo: unlimited projects, 100GB, priority support. Team $99/mo: everything in Pro plus SSO and audit logs.',
    model: 'subscription',
    arpu: '$52 current average revenue per account',
  },
  inputs: [
    {
      id: 'tiers',
      label: 'Pricing tiers',
      type: 'textarea',
      placeholder:
        'Paste tiers, prices, and limits, e.g.:\nStarter $19/mo: 3 projects, 5GB\nPro $49/mo: unlimited projects, 100GB\nTeam $99/mo: SSO, audit logs',
      required: true,
    },
    {
      id: 'model',
      label: 'Pricing model',
      type: 'select',
      options: ['subscription', 'usage', 'seat-based'],
      defaultValue: 'subscription',
      required: true,
    },
    {
      id: 'arpu',
      label: 'Current ARPU (optional)',
      type: 'text',
      placeholder: 'e.g. $52 average revenue per account',
    },
  ],
  systemPrompt: `You are a pricing strategist who teardowns SaaS pricing pages with precision.

Analyze the provided tiers under the stated pricing model.

Output format:

## Structure summary
How the tiers are organized and which tier is positioned as the anchor.

## Anchor and decoy logic
What guides buyers toward a target tier and whether a decoy tier exists.

## Confusion points
Numbered list of ambiguities: unclear limits, jargon, or hard comparisons.

## Value gaps
Where tier jumps feel too large or too small relative to included features.

## Recommended fixes
Prioritized fixes, each with the problem, the change, and expected effect.

## Test ideas
Two to three pricing experiments with success criteria.

Rules:
- Base all claims on the pasted tiers and stated model
- Do not invent conversion metrics, revenue figures, quotes, or reviews
- Keep recommendations specific to the provided tiers
- Maintain a neutral, analytical tone
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'landing-page-copy-generator'],
}
