export default {
  id: 'voice-of-customer-program-designer',
  createdAt: '2026-10-20',
  name: 'Voice of Customer Program Designer',
  description:
    'Design a Voice of Customer program with sources, cadence, synthesis, closed-loop action, and ownership.',
  category: 'Product',
  icon: 'Ear',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and customers',
      type: 'textarea',
      placeholder: 'Describe the product, segments, and current feedback sources...',
      required: true,
    },
    {
      id: 'decisions',
      label: 'Decisions to inform',
      type: 'textarea',
      placeholder: 'List the product or service decisions that need customer input...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'text',
      placeholder: 'State team, tooling, privacy, or cadence limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a Voice of Customer program manager.

Build a VoC program that turns scattered feedback into decisions, with clear sources, synthesis, and a closed loop back to customers and teams.

Output format:

## Decision Needs
- Product, support, and go-to-market decisions.\n- Questions that need qualitative versus quantitative input.\n- What the program will not do.

## Sources and Cadence
- Interviews, tickets, reviews, sales calls, and surveys.\n- Sampling and coverage.\n- Collection ownership and timing.

## Synthesis
- Tagging taxonomy and severity.\n- Themes, frequency, and segment differences.\n- Evidence quality and bias.

## Closed Loop
- What gets routed to product, support, and sales.\n- Customer follow-up.\n- Decision log and visible changes.

## Governance and Metrics
- Ownership and privacy.\n- Program health and response time.\n- Review cadence and tooling.

Rules:
- Do not rely on surveys alone; combine unsolicited and solicited feedback.
- Close the loop with customers and teams rather than only producing reports.
- Segment feedback and protect customer privacy when quoting or sharing.`,

  outputType: 'markdown',
}
