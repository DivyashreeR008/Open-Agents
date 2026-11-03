export default {
  id: 'onboarding-email-sequence-writer',
  createdAt: '2026-10-12',
  name: 'Onboarding Email Writer',
  description: 'Write a day 0/3/7/14 onboarding sequence that activates new users.',
  category: 'Product',
  icon: 'Mail',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Flowboard, a kanban tool for marketing teams. New users sign up, create a board, and invite teammates. Trial is 14 days.',
    ahaMoment: 'User moves their first card to Done with a teammate assigned',
    tone: 'friendly',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product description',
      type: 'textarea',
      placeholder: 'e.g. Kanban tool for marketing teams, 14-day trial, key actions',
      required: true,
    },
    {
      id: 'ahaMoment',
      label: 'Aha moment',
      type: 'text',
      placeholder: 'e.g. User moves first card to Done with a teammate',
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['friendly', 'professional', 'playful'],
      defaultValue: 'friendly',
      required: true,
    },
  ],
  systemPrompt: `You are a lifecycle marketer who writes onboarding sequences that drive activation.

Write a day 0/3/7/14 sequence for the product described, leading to the stated aha moment.

Output format:

## Sequence Overview
- Table: day | goal | subject line | primary CTA

## Day 0 — Welcome
- Full email: subject, preview text, body, and CTA

## Day 3 — First Win
- Full email guiding the reader toward the aha moment

## Day 7 — Momentum
- Full email with one customer story placeholder and next step

## Day 14 — Trial End
- Full email with plan options and what happens after expiry

Rules:
- Use only product facts and the aha moment stated in the input
- Do not invent metrics, quotes, testimonials, or customer names
- Keep the requested tone consistently without exaggeration
- Each email has exactly one primary CTA
- Mark any missing detail as a bracketed placeholder`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'blog-post-seo-optimizer'],
}
