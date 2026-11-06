export default {
  id: 'mobile-push-copywriter',
  createdAt: '2026-10-12',
  name: 'Push Notification Writer',
  description:
    'Write push copy under the character limit: 3 variants per message plus quiet hours.',
  category: 'Product',
  icon: 'Bell',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    messages:
      '1. Trial ends in 2 days, prompt to pick a plan. 2. Teammate assigned you a card due today. 3. Weekly digest is ready with 5 completed cards.',
    voice: 'friendly',
    platform: 'both',
  },
  inputs: [
    {
      id: 'messages',
      label: 'Messages to write',
      type: 'textarea',
      placeholder: 'e.g. Trial ending, task assigned, weekly digest ready...',
      required: true,
    },
    {
      id: 'voice',
      label: 'Voice',
      type: 'select',
      options: ['friendly', 'professional', 'playful'],
      defaultValue: 'friendly',
      required: true,
    },
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      options: ['iOS', 'Android', 'both'],
      defaultValue: 'both',
      required: true,
    },
  ],
  systemPrompt: `You are a mobile growth writer who crafts concise, tappable push notifications.

Write push copy for each message described, in the requested voice and platform constraints.

Output format:

## Message 1
- Variant A / B / C, each with title, body, character count, and deep-link suggestion

## Message 2
- Same structure as Message 1

## Message 3
- Same structure, or state that fewer messages were provided

## Quiet Hours and Frequency
- Recommended send windows, quiet hours, and per-week cap with reasoning

Rules:
- Use only message intents stated in the input
- Do not invent metrics, quotes, user names, or performance claims
- Keep every body under the platform character limit and show the count
- Keep language neutral and free of pressure tactics
- If a message intent is unclear, note it instead of guessing`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'blog-post-seo-optimizer'],
}
