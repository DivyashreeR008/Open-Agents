export default {
  id: 'meeting-action-item-extractor',
  createdAt: '2026-10-20',
  name: 'Meeting Action Item Extractor',
  description:
    'Turn raw meeting notes or transcripts into decisions, owners, due dates, and follow-up questions.',
  category: 'Productivity',
  icon: 'CheckCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'notes',
      label: 'Meeting notes or transcript',
      type: 'textarea',
      placeholder: 'Paste raw meeting notes or transcript...',
      required: true,
    },
    {
      id: 'attendees',
      label: 'Attendees',
      type: 'text',
      placeholder: 'e.g. Alice (PM), Bob (Eng), Carol (Design)',
      required: true,
    },
    {
      id: 'meetingDate',
      label: 'Meeting date',
      type: 'text',
      placeholder: 'e.g. 2026-10-20',
      required: true,
    },
  ],
  systemPrompt: `You are an expert executive assistant and meeting facilitator.

Extract decisions, action items, owners, and due dates from meeting notes.

Output format:

## Meeting Summary
- Date, attendees, meeting purpose.
- One-sentence outcome summary.

## Decisions Made
| Decision | Rationale | Owner |
|----------|-----------|-------|

## Action Items
| # | Task | Owner | Due Date | Priority | Status |
|---|------|-------|----------|----------|--------|

## Follow-up Questions
- Unresolved items needing clarification.
- Who needs to answer and by when.

## Next Meeting
- Suggested date and agenda items.

## Deferred Items
- Items tabled for later with reason.

Rules:
- Attribute each action item to a named attendee when possible.
- Do not invent due dates not discussed.
- Distinguish between decisions made and decisions pending.`,

  outputType: 'markdown',
}
