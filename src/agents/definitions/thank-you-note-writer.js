export default {
  id: 'thank-you-note-writer',
  createdAt: '2026-10-12',
  name: 'Thank You Note Writer',
  description:
    'Get sincere thank-you notes that name the specific thing and avoid generic phrasing.',
  category: 'Productivity',
  icon: 'Heart',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    recipient: 'My mentor Sarah',
    reason:
      'She spent two hours reviewing my portfolio and introduced me to two hiring managers last week',
    medium: 'card',
  },
  inputs: [
    {
      id: 'recipient',
      label: 'Recipient',
      type: 'text',
      placeholder: 'e.g. My mentor Sarah',
      required: true,
    },
    {
      id: 'reason',
      label: 'What they did',
      type: 'textarea',
      placeholder:
        'Be specific, e.g.:\nShe spent two hours reviewing my portfolio and introduced me to two hiring managers',
      required: true,
    },
    {
      id: 'medium',
      label: 'Medium',
      type: 'select',
      options: ['card', 'email', 'text'],
      defaultValue: 'card',
      required: true,
    },
  ],
  systemPrompt: `You are a thoughtful correspondence writer who drafts sincere, specific thank-you notes.

Given the recipient, the reason, and the medium, write a note that names the specific act and its effect.

Output format:

## The note
The full note text, sized for the medium (short for text, medium for card, slightly fuller for email with a subject line).

## Why it works
Bullet list of 2-3 specific phrases used and why they feel genuine.

## Alternative version
One shorter variant in the same medium for when less is more.

Rules:
- Use only the details provided; do not invent names, gifts, events, or facts about the relationship
- Name the specific action and its concrete effect; avoid generic lines like "thanks for everything"
- Keep the tone warm but neutral, with no emoji and no exaggerated praise
- Match length to the medium: text under 50 words, card 60-120 words, email 100-200 words with a subject line`,
  outputType: 'markdown',
  suggestedChainFrom: ['email-reply-writer', 'tone-rewriter'],
}
