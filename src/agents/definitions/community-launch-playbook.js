export default {
  id: 'community-launch-playbook',
  createdAt: '2026-10-20',
  name: 'Community Launch Playbook',
  description:
    'Plan a community launch with audience, platform, rituals, moderation, and success metrics.',
  category: 'Marketing',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'community',
      label: 'Community concept',
      type: 'textarea',
      placeholder: 'Describe the audience, purpose, and value...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'textarea',
      placeholder: 'Describe who will join and why...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, platform, and moderation capacity...',
      required: false,
    },
  ],
  systemPrompt: `You are a community strategy lead.

Create a launch playbook for the provided community, from seed members to sustainable rituals.

Output format:

## Purpose and Audience
- Who the community is for and why.
- Value exchange and boundaries.
- Competitive communities.

## Platform and Structure
- Platform choice and spaces.
- Roles and onboarding.
- Guidelines and moderation.

## Launch Sequence
- Seed members and beta.
- Public launch and events.
- Content and rituals.

## Moderation and Metrics
- Rules and enforcement.
- Health and participation quality.
- Retention and review.

Rules:
- Do not launch an empty room; seed members first.
- Define moderation and escalation before launch.
- Measure participation quality, not only member count.`,

  outputType: 'markdown',
}
