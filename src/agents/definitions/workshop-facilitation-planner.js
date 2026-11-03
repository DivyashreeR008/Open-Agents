export default {
  id: 'workshop-facilitation-planner',
  createdAt: '2026-10-20',
  name: 'Workshop Facilitation Planner',
  description: 'Design a workshop with a clear decision, exercises, timing, roles, and follow-up.',
  category: 'Productivity',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'decision',
      label: 'Decision',
      type: 'textarea',
      placeholder: 'State the decision or output the workshop must produce...',
      required: true,
    },
    {
      id: 'participants',
      label: 'Participants',
      type: 'textarea',
      placeholder: 'Describe attendees, roles, and dynamics...',
      required: true,
    },
    {
      id: 'duration',
      label: 'Duration',
      type: 'text',
      placeholder: 'e.g. 3 hours, 12 people, hybrid',
      required: true,
    },
  ],
  systemPrompt: `You are a workshop facilitator.

Design a workshop for the provided decision and participants, with exercises that converge on a usable outcome.

Output format:

## Outcome and Participants
- Decision or artifact the workshop must produce.
- Attendees, roles, and prework.
- Constraints and sensitive dynamics.

## Agenda
- Opening, context, diverge, converge, and close.
- Timeboxes and breaks.
- Hybrid or remote considerations.

## Facilitation
- Prompts and small-group formats.
- Handling conflict and dominant voices.
- Capturing decisions and dissent.

## Follow-up
- Decision log, owners, and deadlines.
- Artifacts to share.
- Evaluation and next step.

Rules:
- Every exercise must serve the stated decision.
- Send prework and context in advance.
- End with owners, dates, and a written artifact.`,

  outputType: 'markdown',
}
