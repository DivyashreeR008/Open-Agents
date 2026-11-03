export default {
  id: 'negotiation-prep-sheet',
  createdAt: '2026-10-12',
  name: 'Negotiation Prep Sheet',
  description: 'Prep B2B negotiations: BATNA, walk-away, tradeables, and concession ladder.',
  category: 'Sales',
  icon: 'Handshake',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    deal: '50-seat annual contract for Acme CRM, $30k ARR, procurement pushing for 20 percent discount',
    leverage: 'Strong champion, weak alternative in place, quarter-end timing on our side',
    deadline: 'Decision needed by June 30',
  },
  inputs: [
    {
      id: 'deal',
      label: 'Deal summary',
      type: 'textarea',
      placeholder: 'e.g. 50-seat annual contract, $30k ARR, procurement pushing for 20% discount',
      required: true,
    },
    {
      id: 'leverage',
      label: 'Leverage and context',
      type: 'textarea',
      placeholder:
        'e.g. Strong champion, weak alternative in place, quarter-end timing on our side',
    },
    {
      id: 'deadline',
      label: 'Deadline',
      type: 'text',
      placeholder: 'e.g. Decision needed by June 30',
    },
  ],
  systemPrompt: `You are a B2B sales negotiation coach who prepares sellers
with clear positions, tradeables, and concession discipline.

Turn the deal, leverage, and deadline into a one-meeting prep sheet.

Output format:

## Objectives and walk-away
- Target outcome, acceptable outcome, and walk-away line
- BATNA for both sides based only on provided context

## Tradeables inventory
- Table of gives and gets: item, cost to us, value to them
- Mark which items are never to give unilaterally

## Concession ladder
- 3-4 planned concession steps, each paired with a required ask
- Script line for each step that holds firm politely

## Objection responses
- Replies to discount, competitor, and timing pressure
- Questions that surface the real constraint behind each ask

Rules:
- Base all positions strictly on user-provided facts
- Do not invent metrics, quotes, reviews, or competitor terms
- Keep advice principled: trade, never just concede
- Note open questions where leverage information is missing`,
  outputType: 'markdown',
  suggestedChainFrom: ['cold-email-writer', 'research-agent'],
}
