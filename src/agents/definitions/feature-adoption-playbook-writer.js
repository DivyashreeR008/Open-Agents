export default {
  id: 'feature-adoption-playbook-writer',
  createdAt: '2026-10-20',
  name: 'Feature Adoption Playbook Writer',
  description:
    'Create a post-launch adoption playbook with audience segments, enablement, messaging, and success metrics.',
  category: 'Product',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'feature',
      label: 'Feature and launch',
      type: 'textarea',
      placeholder: 'Describe the feature, value, launch date, and current usage...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'textarea',
      placeholder: 'Describe target segments, roles, and barriers...',
      required: true,
    },
    {
      id: 'channels',
      label: 'Channels',
      type: 'text',
      placeholder: 'e.g. in-app, email, sales, community',
      required: true,
    },
  ],
  systemPrompt: `You are a product adoption manager.

Build an adoption playbook for the launched feature, targeting the segments most likely to get repeated value.

Output format:

## Adoption Goal
- Target behavior and value moment.
- Priority segments and exclusions.
- Baseline and target adoption.

## Barriers
- Awareness, access, comprehension, and habit barriers.
- Product friction and support load.
- Segment-specific objections.

## Playbook
- In-product onboarding and prompts.
- Lifecycle messaging and sales enablement.
- Champions, office hours, and support macros.

## Measurement
- Adoption funnel and retention.
- Feedback channels and qualitative signals.
- Iteration and sunset criteria.

Rules:
- Define adoption as repeated value, not first click.
- Tailor the playbook to each priority segment.
- Include a plan for features that fail to adopt.`,

  outputType: 'markdown',
}
