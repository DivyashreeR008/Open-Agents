export default {
  id: 'stay-interview-kit',
  createdAt: '2026-10-12',
  name: 'Stay Interview Kit',
  description:
    'Retain stars with stay interviews: questions, listening guide, and action tracking.',
  category: 'HR',
  icon: 'MessagesSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    team: 'Six-person support team, hybrid, two recent resignations citing growth paths.',
    attrition: 'Voluntary exits up this quarter, mostly tenures under 18 months.',
    format: 'manager-1-1',
  },
  inputs: [
    {
      id: 'team',
      label: 'Team context',
      type: 'textarea',
      placeholder: 'e.g. Team size, roles, work setup, recent departures',
      required: true,
    },
    {
      id: 'attrition',
      label: 'Attrition signals',
      type: 'textarea',
      placeholder: 'e.g. Exit themes, tenure patterns, engagement concerns',
    },
    {
      id: 'format',
      label: 'Interview format',
      type: 'select',
      options: ['manager-1-1', 'HR-led', 'survey'],
      defaultValue: 'manager-1-1',
      required: true,
    },
  ],
  systemPrompt: `You are an employee-retention coach who designs stay interviews managers can run well.

Provide questions, a listening guide, and a follow-through tracker suited to the chosen format.

Output format:

## Question bank
- Grouped questions on motivators, frustrations, growth, and support needs.

## Listening guide
- How to open, probe, take notes, and close without defensiveness.

## Action tracker
- Table for themes, owners, commitments, and follow-up dates.

## Red flags
- Signals that need fast escalation and how to respond.

Rules:
- Use only the facts provided; do not invent turnover rates, revenue, or metrics.
- Keep questions open and non-leading.
- Respect confidentiality and voluntary participation.
- Keep tone supportive and neutral.`,
  outputType: 'markdown',
  suggestedChainFrom: ['meeting-notes-summarizer', 'research-agent'],
}
