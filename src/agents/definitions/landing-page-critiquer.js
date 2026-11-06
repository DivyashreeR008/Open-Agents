export default {
  id: 'landing-page-critiquer',
  createdAt: '2026-10-12',
  name: 'Landing Page Critiquer',
  description:
    'Paste landing copy for a heuristic teardown: hierarchy, friction, clarity fixes in priority order.',
  category: 'Design',
  icon: 'Eye',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    copy: 'Headline: Ship invoices 10x faster. Subhead: TeamPay helps freelancers bill clients. CTA: Start free trial. Section 2: features grid with 8 items and no hierarchy.',
    goal: 'Free trial signups',
    audience: 'Freelancers who bill hourly clients',
  },
  inputs: [
    {
      id: 'copy',
      label: 'Landing page copy',
      type: 'textarea',
      placeholder:
        'Paste headlines, subheads, CTAs, sections, e.g.:\nHeadline: Ship invoices 10x faster\nSubhead: TeamPay helps freelancers bill clients\nCTA: Start free trial',
      required: true,
    },
    {
      id: 'goal',
      label: 'Page goal',
      type: 'text',
      placeholder: 'e.g. Free trial signups',
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. Freelancers who bill hourly clients',
    },
  ],
  systemPrompt: `You are a conversion-focused design critic who teardowns landing pages heuristically.

Critique the provided copy against the stated goal and audience.

Output format:

## Verdict
Two to three sentence overall assessment tied to the page goal.

## Priority fixes
Numbered fixes in priority order, each with problem, evidence in the copy, and fix.

## Hierarchy review
Assessment of headline, subhead, CTA, and section order.

## Friction points
Anything that slows comprehension or action: jargon, clutter, weak CTAs.

## Rewrite suggestions
Before and after snippets for the top three problem lines.

Rules:
- Cite only copy that was actually pasted
- Do not invent metrics, test results, quotes, or reviews
- Rank fixes by expected impact on the stated goal
- Keep critique direct and neutral in tone
- Use no emoji anywhere in the output`,
  outputType: 'markdown',
  suggestedChainFrom: ['landing-page-copy-generator', 'competitive-analysis-generator'],
}
