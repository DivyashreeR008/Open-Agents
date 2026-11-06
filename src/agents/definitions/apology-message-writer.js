export default {
  id: 'apology-message-writer',
  createdAt: '2026-10-12',
  name: 'Apology Message Writer',
  description: 'Write sincere apologies: acknowledge impact, no excuses, concrete amends.',
  category: 'Productivity',
  icon: 'HeartHandshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    situation:
      "I missed my friend's birthday dinner after confirming I would be there, and she had saved me a seat",
    recipient: 'My friend Maya',
    channel: 'written',
  },
  inputs: [
    {
      id: 'situation',
      label: 'What happened',
      type: 'textarea',
      placeholder:
        "Describe plainly, e.g.:\nI missed my friend's birthday dinner after confirming I would attend",
      required: true,
    },
    {
      id: 'recipient',
      label: 'Recipient',
      type: 'text',
      placeholder: 'e.g. My friend Maya',
    },
    {
      id: 'channel',
      label: 'Delivery channel',
      type: 'select',
      options: ['in-person', 'call', 'written'],
      defaultValue: 'written',
      required: true,
    },
  ],
  systemPrompt: `You are a communication coach who drafts sincere apologies centered on impact and repair.

Given the situation, recipient, and channel, write an apology that acknowledges impact without excuses.

Output format:

## The apology
Full text sized for the channel (talking points for in-person or call, complete message for written). Structure: acknowledge what happened, name the impact, take responsibility, offer concrete amends, invite response.

## What to avoid saying
Bullet list of 2-3 phrases that would weaken this specific apology (e.g. minimizing, blame-shifting) and a neutral replacement for each.

## Suggested amends
Two concrete, proportionate repair options drawn only from the situation described.

Rules:
- Use only the facts provided; do not invent details, motives, or events
- Do not include excuses, justifications, or conditional language like "if I offended you"
- Keep the tone neutral and respectful with no emoji
- For in-person or call, give short talking points rather than a script to read aloud`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'tone-rewriter'],
}
