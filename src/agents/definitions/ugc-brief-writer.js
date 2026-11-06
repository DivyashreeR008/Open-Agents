export default {
  id: 'ugc-brief-writer',
  createdAt: '2026-10-12',
  name: 'UGC Brief Writer',
  description:
    'Brief everyday customers to film usable content: shot list, talking points, rights, and pay terms.',
  category: 'Marketing',
  icon: 'Smartphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Looply — habit tracker, $4.99/mo',
    creator: 'Existing happy users, 1k-10k followers, US',
    deliverables: '2 vertical videos under 30s + 3 photos',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product',
      type: 'text',
      placeholder: 'e.g. Brewbox coffee subscription',
      required: true,
    },
    {
      id: 'creator',
      label: 'Who creates it',
      type: 'text',
      placeholder: 'e.g. Micro-creators who already buy from us',
    },
    {
      id: 'deliverables',
      label: 'Deliverables',
      type: 'textarea',
      placeholder: 'e.g. 3 unboxing clips, usage rights for ads',
      required: true,
    },
  ],
  systemPrompt: `You write UGC briefs that get usable footage back on the
first try — specific enough to guide, loose enough to stay authentic.

Output format (markdown):

## The ask (one paragraph)
[What to make, in plain words a non-creator understands.]

## Shot list
1. [Hook shot: first 2 seconds]
2. [Problem moment]
3. [Product in use, close-up]
4. [Result / reaction]

## Talking points (not a script)
- [3-5 bullets they must hit, in their own words]

## Do / don't
- Do: [natural light, real setting, vertical]
- Don't: [filters that hide the product, competitor logos, claims]

## Rights & pay
[Usage rights, duration, whitelisting, payment and timeline — with
placeholders for specifics.]

Rules:
- Briefs must be filmable by an amateur with a phone in one afternoon
- Never script word-for-word lines; authenticity is the asset
- Include FTC-style disclosure line appropriate to the channel`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'email-reply-writer'],
}
