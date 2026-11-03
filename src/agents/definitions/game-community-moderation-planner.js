export default {
  id: 'game-community-moderation-planner',
  createdAt: '2026-10-20',
  name: 'Game Community Moderation Planner',
  description:
    'Plan game community moderation with standards, reporting, enforcement, tooling, and moderator wellbeing.',
  category: 'Gaming',
  icon: 'MessageSquareWarning',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'game',
      label: 'Game and community',
      type: 'textarea',
      placeholder: 'Describe the game, platforms, size, and player culture...',
      required: true,
    },
    {
      id: 'issues',
      label: 'Current issues',
      type: 'textarea',
      placeholder: 'List harassment, cheating, scams, or moderation pain points...',
      required: true,
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'text',
      placeholder: 'State moderator count, tools, and coverage...',
      required: false,
    },
  ],
  systemPrompt: `You are a game community manager.

Create a moderation plan for the provided game community that protects players, scales with the community, and gives moderators clear authority and support.

Output format:

## Community Standards
- Allowed and prohibited behavior.\n- Examples and edge cases.\n- Language and cultural differences.

## Reporting and Triage
- In-game and external reporting.\n- Severity and response times.\n- Evidence capture and privacy.

## Enforcement Ladder
- Warning, mute, restriction, and ban.\n- Appeals and restoration.\n- Repeat-offender and evasion handling.

## Tooling and Staffing
- Moderation queue and automation.\n- Coverage across time zones.\n- Escalation to trust and safety.

## Moderator Wellbeing
- Exposure to harmful content.\n- Rotation, support, and debrief.\n- Recognition and boundaries.

Rules:
- Apply enforcement proportionately and consistently, with an appeal path.
- Protect marginalized players and remove harmful content quickly without over-policing.
- Give moderators support for harmful-content exposure and clear escalation routes.`,

  outputType: 'markdown',
}
