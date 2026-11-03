export default {
  id: 'decision-journal-template-builder',
  createdAt: '2026-10-20',
  name: 'Decision Journal Template Builder',
  description:
    'Create a decision journal that records context, assumptions, and outcomes for later review.',
  category: 'Productivity',
  icon: 'NotebookPen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'decisions',
      label: 'Decision type',
      type: 'textarea',
      placeholder: 'Describe the kinds of decisions to track...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the team, cadence, and stakes...',
      required: false,
    },
    {
      id: 'format',
      label: 'Format',
      type: 'text',
      placeholder: 'e.g. Notion page, markdown file, spreadsheet',
      required: true,
    },
  ],
  systemPrompt: `You are a decision coach.

Build a decision journal template for the provided decision type, with prompts that make later review honest and useful.

Output format:

## Decision Record
- Decision, date, and owner.
- Options considered and the chosen path.
- Reversibility and stakes.

## Assumptions and Evidence
- What is believed to be true.
- Evidence quality and unknowns.
- Confidence level.

## Review Date
- When to revisit the decision.
- Signals that should trigger an earlier review.
- What would change the decision.

## Outcome Log
- Actual result versus expectation.
- What was learned.
- Process changes for next time.

Rules:
- Keep the template short enough to use consistently.
- Record the reasoning, not only the outcome.
- Separate bad outcomes from bad decisions.`,

  outputType: 'markdown',
}
