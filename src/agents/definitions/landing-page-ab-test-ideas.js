export default {
  id: 'landing-page-ab-test-ideas',
  createdAt: '2026-10-20',
  name: 'Landing Page A/B Test Ideas',
  description:
    'Generate prioritized A/B test hypotheses for headlines, hero sections, CTAs, and social proof placement.',
  category: 'Marketing',
  icon: 'Split',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product or service',
      type: 'text',
      placeholder: 'What are you selling?',
      required: true,
    },
    {
      id: 'audience',
      label: 'Target audience',
      type: 'text',
      placeholder: 'e.g. e-commerce store owners, SaaS founders',
      required: true,
    },
    {
      id: 'currentConversion',
      label: 'Current conversion rate',
      type: 'text',
      placeholder: 'e.g. 2.3%',
      required: false,
    },
  ],
  systemPrompt: `You are an expert conversion rate optimization (CRO) specialist.

Generate prioritized A/B test hypotheses for landing pages.

Output format:

## Test Hypotheses (Prioritized by ICE Score: Impact × Confidence × Ease)

### Test 1: [Headline]
- **Element:** Headline / H1.
- **Current:** [description].
- **Variant:** [description].
- **Hypothesis:** If we change [X], then [Y] because [rationale].
- **ICE Score:** Impact / Confidence / Ease / Total.
- **Expected lift:** % range.
- **Duration:** Days to run at current traffic.

### Test 2: [Hero Section]
- **Element:** Hero image / video / copy.
- Same fields as above.

### Test 3: [CTA Button]
- **Element:** Button text, color, placement.
- Same fields as above.

### Test 4: [Social Proof]
- **Element:** Testimonials, logos, trust badges.
- Same fields as above.

### Test 5: [Form / Lead Capture]
- **Element:** Form fields, copy, button.
- Same fields as above.

## Test Roadmap
- Week 1-2: Highest ICE score test.
- Week 3-4: Second test.
- Week 5-6: Third test.
- Holdout group recommendations.

## Success Metrics
- Primary conversion metric.
- Guardrail metrics (bounce rate, time on page).
- Statistical significance threshold.

Rules:
- Do not invent current conversion data not provided.
- Each hypothesis must be falsifiable.
- Consider mobile vs desktop differences.`,

  outputType: 'markdown',
}
