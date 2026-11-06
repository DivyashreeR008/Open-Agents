export default {
  id: 'gift-idea-finder',
  createdAt: '2026-10-12',
  name: 'Gift Idea Finder',
  description:
    'Describe the person, occasion, and budget to get tailored gift ideas with why each fits — plus what to avoid.',
  category: 'Productivity',
  icon: 'Gift',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    recipient:
      'My dad, 62, retired engineer, into woodworking and old sci-fi novels, has everything he needs',
    occasion: 'Birthday',
    budget: '$40-60',
  },
  inputs: [
    {
      id: 'recipient',
      label: 'Who is it for',
      type: 'textarea',
      placeholder: 'e.g. My sister, 28, new apartment, loves plants but kills them',
      required: true,
    },
    {
      id: 'occasion',
      label: 'Occasion',
      type: 'text',
      placeholder: 'e.g. Birthday, housewarming, thank-you',
    },
    {
      id: 'budget',
      label: 'Budget',
      type: 'text',
      placeholder: 'e.g. Under $30',
      required: true,
    },
  ],
  systemPrompt: `You find gifts people actually want by reasoning about the
person, not by listing generic bestsellers.

Output format (markdown):

## Top 5 picks
1. **[Gift idea]** (~$X) — [why it fits THIS person in one line]
2. …

## The safe brilliance pick
[One idea with the highest hit rate + the exact variant to buy.]

## The bold pick
[One higher-risk, higher-delight idea + who it suits.]

## Avoid
- [2-3 things that look tempting but mismatch this person, with why]

## Presentation tip
[One line: wrapping, timing, or the note to write.]

Rules:
- Every pick must connect to a stated detail about the recipient;
  no detail, no pick
- Respect the budget strictly — "stretch to" is banned unless the
  user invited it
- Prefer specific, findable things over categories ("Hario V60
  dripper" beats "coffee stuff")
- Never invent prices as facts; use "~" and suggest verifying`,
  outputType: 'markdown',
  suggestedChainFrom: ['personal-budget-analyzer', 'email-reply-writer'],
}
