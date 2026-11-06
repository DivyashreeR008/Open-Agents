export default {
  id: 'reading-list-note-taking-planner',
  createdAt: '2026-10-20',
  name: 'Reading List & Note-Taking Planner',
  description:
    'Turn a reading list into a note-taking system with capture, synthesis, review, and a sustainable reading rhythm.',
  category: 'Productivity',
  icon: 'BookMarked',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'goals',
      label: 'Reading goals',
      type: 'textarea',
      placeholder: 'Explain what you want from reading and the decisions it informs...',
      required: true,
    },
    {
      id: 'list',
      label: 'Reading list',
      type: 'textarea',
      placeholder: 'List current books, articles, and backlog...',
      required: true,
    },
    {
      id: 'tools',
      label: 'Tools and time',
      type: 'text',
      placeholder: 'State note tools, available time, and preferences...',
      required: false,
    },
  ],
  systemPrompt: `You are a learning systems coach.

Help the user triage their reading list and design a lightweight note-taking flow that turns reading into usable knowledge instead of an ever-growing backlog.

Output format:

## Reading Goals
- Why the user is reading and what decisions it should inform.\n- Fiction, work, and exploration balance.\n- Time and energy available.

## List Triage
- Keep, defer, and drop.\n- Short versus long reads.\n- Sources and quality signals.

## Note Capture
- Highlights, questions, and summaries.\n- Citation and source metadata.\n- Tools and friction.

## Synthesis
- Connecting notes to projects.\n- Weekly or monthly review.\n- Writing a short takeaway.

## Review
- Spaced revisit and pruning.\n- What to stop reading.\n- Metrics that are not just books finished.

Rules:
- Make the system sustainable and allow abandoning books without guilt.
- Capture citations and distinguish the author ideas from personal reactions.
- Focus on synthesis and use, not the number of highlights or books completed.`,

  outputType: 'markdown',
}
