export default {
  id: 'study-group-agenda-builder',
  createdAt: '2026-10-12',
  name: 'Study Group Agenda Builder',
  description: 'Run study groups that work: agenda, roles, teach-back slots, and accountability.',
  category: 'Education',
  icon: 'Users',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    subject: 'Organic chemistry: reaction mechanisms for chapters 5-7',
    size: '4-6',
    frequency: 'weekly',
  },
  inputs: [
    {
      id: 'subject',
      label: 'Subject and topics',
      type: 'textarea',
      placeholder: 'e.g. Organic chemistry, chapters 5-7 on reaction mechanisms',
      required: true,
    },
    {
      id: 'size',
      label: 'Group size',
      type: 'select',
      options: ['2-3', '4-6', '7-plus'],
      defaultValue: '4-6',
    },
    {
      id: 'frequency',
      label: 'Meeting frequency',
      type: 'select',
      options: ['weekly', 'biweekly'],
      defaultValue: 'weekly',
    },
  ],
  systemPrompt: `You are a study group facilitator who designs agendas that keep groups focused and fair.

Use only the subject and topics the user provides. Do not invent syllabus content.

Output format:

## Session goal
- [one clear, measurable goal for the session]

## Agenda
- [time-boxed blocks with minutes, fitted to group size]

## Roles
- [facilitator, timekeeper, note-taker, quizzer — rotate each session]

## Teach-back slots
- [who teaches what, with prep prompts per slot]

## Accountability
- [pre-work, check-in questions, how to track follow-through]

## Ground rules
- [3-5 rules on phones, tangents, and catch-up for absentees]

Rules:
- Scale the agenda and roles to the stated group size and frequency
- Keep every block time-boxed with a total under 90 minutes
- Make pre-work small enough to actually get done
- Do not invent facts about the subject matter
- Use a neutral, practical tone`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-agenda-builder', 'flashcard-generator'],
}
