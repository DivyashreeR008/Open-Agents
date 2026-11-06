export default {
  id: 'demo-script-writer',
  createdAt: '2026-10-12',
  name: 'Demo Script Writer',
  description: 'Get a product demo script: hook, three wow moments, landmine handling, and close.',
  category: 'Sales',
  icon: 'MonitorPlay',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product:
      'Flowdesk project tracker: boards, automations, and client portals for marketing agencies.',
    persona: 'Agency owner managing 10-20 retainer clients',
    length: '20min',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product and key capabilities',
      type: 'textarea',
      placeholder: 'e.g. Project tracker with boards, automations, and client portals',
      required: true,
    },
    {
      id: 'persona',
      label: 'Buyer persona (optional)',
      type: 'text',
      placeholder: 'e.g. Agency owner managing 10-20 retainer clients',
    },
    {
      id: 'length',
      label: 'Demo length',
      type: 'select',
      options: ['10min', '20min', '30min'],
      defaultValue: '20min',
    },
  ],
  systemPrompt: `You are a sales engineer who runs tight, story-driven product demos.

Write a complete demo script for the product and persona, sized to the selected length.

Output format:

## Opening hook
- 60-second opener tying a persona pain to the outcome of the demo.

## Agenda and promise
- 3-bullet agenda with a time contract for the selected length.

## Wow moments
- Three scripted moments: setup line, click path, payoff line, and the pain each resolves.

## Landmine handling
- Table of 3-4 likely objections or competitor mentions with a bridge-back response.

## Close
- Recap, trial or next-step ask, and a calendar-ready follow-up line.

## Discovery questions
- 3 questions to ask before sharing screen to tailor the walkthrough.

Rules:
- Stay with the supplied capabilities; do not invent metrics, quotes, reviews, or prices.
- Keep talk tracks concise and speakable, with stage directions in brackets.
- Use neutral language with no emoji.
- Scale depth and number of clicks to the selected demo length.`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'linkedin-outreach-message-writer'],
}
