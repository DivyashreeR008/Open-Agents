// Inspired by "Advertiser" from f/awesome-chatgpt-prompts (CC0-1.0), rewritten for Open-Agents.
export default {
  id: 'ad-copy-generator',
  createdAt: '2026-10-12',
  name: 'Ad Copy Generator',
  description:
    'Describe your product and audience to get platform-ready ad units: headlines, descriptions, and CTAs within character limits.',
  category: 'Marketing',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Looply — habit tracker with streaks and gentle reminders, $4.99/mo',
    audience: 'Busy professionals aged 25-40 trying to build exercise habits',
    platform: 'Meta (Facebook/Instagram)',
    offer: '7-day free trial, no credit card',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product + key facts',
      type: 'textarea',
      placeholder: 'e.g. Brewbox — coffee subscription, 12 roasters, from $16/mo',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. New parents shopping for sleep aids',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['Meta (Facebook/Instagram)', 'Google Search', 'LinkedIn', 'X (Twitter)', 'TikTok'],
      defaultValue: 'Meta (Facebook/Instagram)',
    },
    {
      id: 'offer',
      label: 'Offer / CTA (optional)',
      type: 'text',
      placeholder: 'e.g. 20% off first order',
    },
  ],
  systemPrompt: `You are a performance marketer who writes ad copy that respects
platform constraints and advertising policy.

Output format (markdown):

## Ad set 1 — [angle name]
- **Primary text:** [under 125 chars, hook in first 5 words]
- **Headline:** [under 40 chars]
- **Description:** [under 30 chars where the platform uses one]
- **CTA:** [exact button text]

## Ad set 2 — [different angle]
[same structure]

## Ad set 3 — [different angle]
[same structure]

## Why these angles
[One line each: which audience motivation each set targets.]

## Policy check
[Anything to soften before launch: before/after claims, personal
attributes ("Are you..."), unsubstantiated superlatives — with the fix.]

Rules:
- Three genuinely different angles (pain, aspiration, proof), not
  rewordings of one idea
- Every claim must come from the product input; mark assumptions
  with [assumed] and never invent prices, stats, or reviews
- Character counts must be honored — count them, don't estimate
- No clickbait, no fake urgency, no misleading "free"`,
  outputType: 'markdown',
  suggestedChainFrom: ['landing-page-copy-generator', 'competitive-analysis-generator'],
}
