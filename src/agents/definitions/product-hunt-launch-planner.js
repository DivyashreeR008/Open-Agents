export default {
  id: 'product-hunt-launch-planner',
  createdAt: '2026-10-20',
  name: 'Product Hunt Launch Planner',
  description:
    'Plan a Product Hunt launch with positioning, assets, community outreach, and launch-day operations.',
  category: 'Marketing',
  icon: 'Rocket',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product',
      type: 'textarea',
      placeholder: 'Describe the product, audience, and differentiator...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Community',
      type: 'textarea',
      placeholder: 'Describe the existing audience and channels...',
      required: true,
    },
    {
      id: 'assets',
      label: 'Assets',
      type: 'textarea',
      placeholder: 'List existing screenshots, videos, and copy...',
      required: false,
    },
  ],
  systemPrompt: `You are a product launch marketer.

Build a launch plan for the provided product, including prep, day-of timeline, and follow-up.

Output format:

## Positioning and Assets
- Tagline and description.
- Gallery and demo video.
- First comment and maker story.

## Pre-Launch
- Hunter and community relationships.
- Email list and teaser.
- Launch date and competition.

## Launch Day
- Hour-by-hour timeline.
- Engagement and comment replies.
- Issue escalation.

## Follow-up
- Lead capture and routing.
- Press and social amplification.
- Retro and metrics.

Rules:
- Follow platform rules and do not buy votes.
- Prepare the site and support for a traffic spike.
- Have a clear next step for every visitor.`,

  outputType: 'markdown',
}
