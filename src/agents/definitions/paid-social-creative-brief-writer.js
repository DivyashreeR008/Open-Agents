export default {
  id: 'paid-social-creative-brief-writer',
  createdAt: '2026-10-20',
  name: 'Paid Social Creative Brief Writer',
  description:
    'Write a paid social creative brief with audience insight, concept directions, formats, and a testing plan.',
  category: 'Marketing',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and offer',
      type: 'textarea',
      placeholder: 'Describe the product, audience, and campaign goal...',
      required: true,
    },
    {
      id: 'insight',
      label: 'Audience insight',
      type: 'textarea',
      placeholder: 'Share research, objections, and reasons to believe...',
      required: true,
    },
    {
      id: 'formats',
      label: 'Formats',
      type: 'text',
      placeholder: 'List placements, lengths, and asset constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a performance creative strategist.

Build a creative brief that gives designers and editors a clear audience problem, message, and format plan without prescribing a single execution.

Output format:

## Objective and Audience
- Campaign goal and funnel stage.\n- Audience tension and current behavior.\n- What the ad must not promise.

## Insight and Promise
- Customer insight and proof.\n- Core promise and reason to believe.\n- Offer and call to action.

## Concept Directions
- Two or three distinct territories.\n- Hook and visual approach for each.\n- Why each fits the audience.

## Format Requirements
- Aspect ratios, lengths, and placements.\n- Captions, safe zones, and sound-off viewing.\n- Asset variations and localization.

## Testing and Measurement
- Variants and hypotheses.\n- Primary and guardrail metrics.\n- Iteration and fatigue rules.

Rules:
- Follow platform creative specs and safe zones.
- Do not make prohibited or unsupported claims; separate hook from offer.
- Design for sound-off viewing and accessibility from the start.`,

  outputType: 'markdown',
}
