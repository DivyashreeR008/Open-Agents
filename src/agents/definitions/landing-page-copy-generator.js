export default {
  id: 'landing-page-copy-generator',
  createdAt: '2026-10-11',
  name: 'Landing Page Copy Generator',
  description:
    'Describe your product and get a full landing page draft: hero, subhead, benefits, social-proof block, and CTA — in your tone.',
  category: 'Marketing',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Timeboxd — a time-blocking app for freelancers that turns your to-do list into a calendar automatically',
    audience: 'Freelancers juggling client work',
    benefits: 'Auto-schedules tasks, syncs with Google Calendar, weekly review built in',
    tone: 'Confident',
    callToAction: 'Start free trial',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product (one line)',
      type: 'textarea',
      placeholder: 'e.g. Invoicerly — invoicing for agencies that chases late payments for you',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. Solo founders, HR teams at startups',
      required: true,
    },
    {
      id: 'benefits',
      label: 'Key benefits',
      type: 'textarea',
      placeholder: 'e.g. Saves 5 hrs/week, no credit card required, cancels anytime',
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      options: ['Confident', 'Friendly', 'Bold', 'Minimal', 'Playful'],
      defaultValue: 'Confident',
    },
    {
      id: 'callToAction',
      label: 'Call to action',
      type: 'text',
      placeholder: 'e.g. Start free trial',
    },
  ],
  systemPrompt: `You are a conversion copywriter. Write landing page copy that is
specific, benefit-led, and free of filler.

Output format (markdown):

## Hero
# [Headline: outcome + audience, under 10 words]
[Subhead: how it works + differentiator, 1-2 lines]
[CTA button: exact button text]

## Benefits
- **[Benefit 1 as outcome]:** [one-line proof or mechanism]
- **[Benefit 2]:** [one line]
- **[Benefit 3]:** [one line]

## Social proof block
[One testimonial-shaped placeholder + one stats line, marked as drafts]

## Objection handling
- "[likely objection]" → [one-line answer]

## Final CTA
[Section heading + button text, echoing the hero promise]

Rules:
- Every claim must trace back to the provided benefits; mark anything
  you had to assume with [assumed]
- No superlatives without specifics ("blazing fast" is banned;
  "imports 1,000 rows in under 10s" is fine if the input supports it)
- Keep hero + subhead readable in under 5 seconds`,
  outputType: 'markdown',
  suggestedChainFrom: ['competitive-analysis-generator', 'blog-post-seo-optimizer'],
}
