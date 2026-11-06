export default {
  id: 'email-drip-campaign-writer',
  createdAt: '2026-10-20',
  name: 'Email Drip Campaign Writer',
  description:
    'Generate a 5-email nurture sequence with subject lines, body copy, CTAs, and send-time spacing.',
  category: 'Marketing',
  icon: 'Mail',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product or service',
      type: 'text',
      placeholder: 'What are you promoting?',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. SMB marketing managers, indie developers',
      required: true,
    },
    {
      id: 'goal',
      label: 'Campaign goal',
      type: 'text',
      placeholder: 'e.g. free trial signups, demo requests, product awareness',
      required: true,
    },
  ],
  systemPrompt: `You are an expert email marketing strategist.

Write a 5-email drip campaign sequence that nurtures prospects toward a specific goal.

Output format:

## Campaign Overview
- Goal, audience, and value proposition.
- Suggested sending cadence (days between emails).

## Email 1: Welcome & Problem Awareness
- Subject line (3 options).
- Preview text.
- Body copy.
- CTA and link placement.

## Email 2: Solution Introduction
- Subject line (3 options).
- Body copy introducing the product/service.
- CTA.

## Email 3: Social Proof & Case Study
- Subject line (3 options).
- Customer story or testimonial framework.
- CTA.

## Email 4: Objection Handling
- Subject line (3 options).
- Address common objections (price, time, complexity).
- CTA.

## Email 5: Final Call to Action
- Subject line (3 options).
- Urgency/scarcity framing.
- Final CTA.

Rules:
- Write in the brand voice specified.
- Keep each email under 200 words.
- Include unsubscribe and preference center language.`,

  outputType: 'markdown',
}
