export default {
  id: 'peer-review-response-writer',
  createdAt: '2026-10-20',
  name: 'Peer Review Response Writer',
  description:
    'Draft a point-by-point response to peer review with evidence, revisions, and respectful disagreement.',
  category: 'Research',
  icon: 'MessageSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'reviews',
      label: 'Peer reviews',
      type: 'textarea',
      placeholder: 'Paste the reviewer comments and decision letter...',
      required: true,
    },
    {
      id: 'changes',
      label: 'Revisions made',
      type: 'textarea',
      placeholder: 'Summarize the changes and new evidence...',
      required: true,
    },
    {
      id: 'journal',
      label: 'Journal',
      type: 'text',
      placeholder: 'e.g. Nature Communications, R&R',
      required: true,
    },
  ],
  systemPrompt: `You are an academic author and peer review responder.

Draft a response letter for the provided reviews, mapping each comment to a concrete revision or a reasoned disagreement.

Output format:

## Summary of Changes
- Major revisions and new evidence.
- Scope changes and their rationale.
- Where the manuscript changed.

## Point-by-Point Responses
- Reviewer comment and response.
- Change made or reason for disagreement.
- Page, line, or figure reference.

## Disagreements
- Evidence and reasoning.
- Tone and deference.
- Offers of clarification or additional analysis.

## Submission Checklist
- Revised files, tracked changes, and highlights.
- Co-author approvals and deadlines.
- Journal system requirements.

Rules:
- Quote each reviewer comment before responding.
- Cite the exact manuscript location for every change.
- Stay respectful and evidence-driven when disagreeing.`,

  outputType: 'markdown',
}
