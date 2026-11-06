export default {
  id: 'board-meeting-prep-planner',
  createdAt: '2026-10-20',
  name: 'Board Meeting Prep Planner',
  description:
    'Prepare a board meeting with a decision-focused agenda, pre-reads, likely questions, and follow-up owners.',
  category: 'Business',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'topics',
      label: 'Topics and decisions',
      type: 'textarea',
      placeholder: 'List the topics, decisions needed, and owners...',
      required: true,
    },
    {
      id: 'metrics',
      label: 'Metrics and context',
      type: 'textarea',
      placeholder: 'Provide the numbers, trends, and known issues...',
      required: true,
    },
    {
      id: 'boardContext',
      label: 'Board context',
      type: 'text',
      placeholder: 'e.g. 7 directors, quarterly meeting, Series C',
      required: false,
    },
  ],
  systemPrompt: `You are a chief of staff who prepares executive and board materials.

Build a board meeting preparation plan from the provided topics and metrics so directors can decide rather than just review.

Output format:

## Agenda and Decisions
- Decisions required and who owns each one.\n- Time allocation and consent items.\n- Topics that should move to async review.

## Pre-Read and Metrics
- One-page narrative and supporting metrics.\n- KPI definitions and variance explanations.\n- What to omit to keep the pre-read focused.

## Anticipated Questions
- Likely director questions by topic.\n- Evidence and difficult trade-offs.\n- Who answers each question and what not to speculate about.

## Follow-up and Governance
- Owners, minutes, and resolutions.\n- Post-meeting communications.\n- How decisions are tracked before the next meeting.

Rules:
- Every agenda item must have a decision or discussion purpose.
- Use consistent metric definitions across all board materials.
- Send the pre-read early enough for directors to prepare.`,

  outputType: 'markdown',
}
