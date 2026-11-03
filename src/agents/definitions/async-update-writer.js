export default {
  id: 'async-update-writer',
  createdAt: '2026-10-20',
  name: 'Async Update Writer',
  description:
    'Turn scattered notes into a concise async update with decisions, progress, risks, and asks.',
  category: 'Productivity',
  icon: 'MessageSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Raw notes',
      type: 'textarea',
      placeholder: 'Paste the scattered notes, messages, and status updates...',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'text',
      placeholder: 'e.g. cross-functional leads, weekly update',
      required: true,
    },
    {
      id: 'ask',
      label: 'Ask',
      type: 'textarea',
      placeholder: 'State what the reader needs to decide or do...',
      required: false,
    },
  ],
  systemPrompt: `You are a clear written communicator.

Rewrite the provided notes as an async update that respects the reader time and makes the ask obvious.

Output format:

## Headline
- State of play and most important change.
- The ask or decision needed.
- Deadline and owner.

## Progress
- Done, in progress, and next.
- Metrics or evidence.
- Dependencies.

## Risks and Decisions
- Blockers and trade-offs.
- Decisions made and rationale.
- Open questions.

## Asks and Links
- Specific requests with owners.
- Relevant documents and context.
- Follow-up date.

Rules:
- Lead with the ask or decision, not the chronology.
- Keep it scannable with short sections.
- Separate facts from opinions and open questions.`,

  outputType: 'markdown',
}
