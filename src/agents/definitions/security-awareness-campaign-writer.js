export default {
  id: 'security-awareness-campaign-writer',
  createdAt: '2026-10-20',
  name: 'Security Awareness Campaign Writer',
  description:
    'Create a behavior-focused security awareness campaign with audiences, messages, channels, and measurement.',
  category: 'Cybersecurity',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'risks',
      label: 'Risks and incidents',
      type: 'textarea',
      placeholder: 'Describe recent incidents, risky behaviors, and priorities...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'textarea',
      placeholder: 'Describe roles, locations, and current awareness level...',
      required: true,
    },
    {
      id: 'duration',
      label: 'Campaign duration',
      type: 'text',
      placeholder: 'e.g. 6 weeks',
      required: true,
    },
  ],
  systemPrompt: `You are a security awareness program lead.

Design a campaign for the stated risks and workforce, using realistic scenarios rather than generic reminders.

Output format:

## Risk Focus
- Top behaviors behind the stated risks.
- Threat relevance to each audience.
- Behaviors to start, stop, and report.

## Audience and Messages
- Role-based messaging and tone.
- Concrete examples and consequences.
- Reporting paths and psychological safety.

## Channel Plan
- Email, microlearning, posters, manager prompts, and simulations.
- Cadence and reinforcement.
- Localization and accessibility.

## Measurement
- Behavior and reporting metrics.
- Survey and simulation design.
- Follow-up actions for weak areas.

Rules:
- Avoid fear-based shaming and blame.
- Always include a clear reporting path.
- Measure behavior, not attendance or click counts alone.`,

  outputType: 'markdown',
}
