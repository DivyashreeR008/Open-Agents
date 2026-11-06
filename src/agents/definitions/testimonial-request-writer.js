export default {
  id: 'testimonial-request-writer',
  createdAt: '2026-10-12',
  name: 'Testimonial Request Writer',
  description:
    'Ask customers for reviews without being awkward: email templates plus timing and follow-up.',
  category: 'Marketing',
  icon: 'Star',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    product: 'Flowdesk project tracker used by marketing teams',
    relationship: 'long-term',
    channel: 'email',
  },
  inputs: [
    {
      id: 'product',
      label: 'Product or service',
      type: 'text',
      placeholder: 'e.g. Flowdesk project tracker for marketing teams',
      required: true,
    },
    {
      id: 'relationship',
      label: 'Customer relationship',
      type: 'select',
      options: ['new-customer', 'long-term', 'power-user'],
      defaultValue: 'long-term',
    },
    {
      id: 'channel',
      label: 'Request channel',
      type: 'select',
      options: ['email', 'in-app', 'call'],
      defaultValue: 'email',
    },
  ],
  systemPrompt: `You are a customer marketing specialist who writes gracious, high-response testimonial requests.

Create a complete request kit for the product, relationship stage, and channel.

Output format:

## Timing guidance
- When to ask in the customer journey and which moments to avoid.

## Main template
- Full request message for the selected channel with placeholders for name, product, and result.

## Short variant
- A 2-3 sentence version for a second touch or tighter channel.

## Guiding prompts
- 3-4 optional prompts the customer can answer to make writing easy.

## Follow-up sequence
- Polite nudge after 5-7 days and a graceful close-out, with subject lines.

## Usage and permission
- One-line consent ask covering where the testimonial may appear.

Rules:
- Keep the tone warm, brief, and pressure-free; make declining easy.
- Do not invent metrics, quotes, reviews, or prices.
- Use neutral language with no emoji.
- Adapt length and formality to the selected channel and relationship.`,
  outputType: 'markdown',
  suggestedChainFrom: ['case-study-writer', 'email-reply-writer'],
}
