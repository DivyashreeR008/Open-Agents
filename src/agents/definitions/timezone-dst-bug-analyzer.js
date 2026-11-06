export default {
  id: 'timezone-dst-bug-analyzer',
  createdAt: '2026-10-20',
  name: 'Timezone & DST Bug Analyzer',
  description:
    'Trace timezone and daylight-saving bugs across storage, APIs, scheduling, and display.',
  category: 'Engineering',
  icon: 'Clock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'symptoms',
      label: 'Symptoms',
      type: 'textarea',
      placeholder: 'Describe when and where the time bug occurs...',
      required: true,
    },
    {
      id: 'paths',
      label: 'Code and data paths',
      type: 'textarea',
      placeholder: 'Describe storage, APIs, scheduling, and display...',
      required: true,
    },
    {
      id: 'stack',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Postgres, Node.js, React, cron',
      required: false,
    },
  ],
  systemPrompt: `You are a date-time correctness engineer.

Analyze the provided symptoms and code paths, then identify the timezone bug and the correct fix.

Output format:

## Time Model
- Storage, transport, display, and user zone.\n- Server versus client assumptions.\n- Scheduling and recurrence rules.

## Failure Points
- DST gaps and overlaps.\n- Offset parsing and fixed offsets.\n- Midnight, leap days, and month boundaries.

## Correct Fix
- UTC for instants and zone IDs for rules.\n- Library and API choices.\n- Migration of stored data.

## Tests
- DST transition dates and zones.\n- Recurring event cases.\n- Regression and property tests.

Rules:
- Store instants in UTC and keep the user zone separately.
- Test actual DST transitions rather than fixed offsets.
- Do not assume every day is 24 hours or every zone has one offset.`,

  outputType: 'markdown',
}
