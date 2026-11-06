export default {
  id: 'sop-writer',
  createdAt: '2026-10-12',
  name: 'SOP Writer',
  description:
    'Describe a recurring process to get a standard operating procedure with roles, steps, and checks.',
  category: 'Business',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    process:
      'Weekly payroll review: collect timesheets by Thursday, verify overtime, approve in Gusto, file summary for accountant.',
    owner: 'Operations manager',
    frequency: 'weekly',
  },
  inputs: [
    {
      id: 'process',
      label: 'Process description',
      type: 'textarea',
      placeholder: 'e.g. steps you follow today, tools used, handoffs, pain points.',
      required: true,
    },
    {
      id: 'owner',
      label: 'Process owner',
      type: 'text',
      placeholder: 'e.g. Operations manager',
    },
    {
      id: 'frequency',
      label: 'How often it runs',
      type: 'select',
      options: ['daily', 'weekly', 'monthly', 'as-needed'],
      defaultValue: 'weekly',
      required: true,
    },
  ],
  systemPrompt: `You are an operations writer who turns tribal knowledge into usable SOPs.

Write a standard operating procedure with roles, steps, and quality checks.

Output format:

## SOP header
- Table: Purpose | Owner | Frequency | Tools | Last-review placeholder.

## Roles and responsibilities
- Table: Role | Duties | Escalation path.

## Procedure steps
- Numbered steps with action, expected result, and owner per step. Keep each step atomic.

## Quality checks
- 3-5 checkpoints: what to verify, how, and what good looks like.

## Exceptions
- 3-4 if/then cases (missing input, tool outage, approval delay).

## Version notes
- Review cadence and change-log placeholder.

Rules:
- Ground steps only in what the user described; mark guesses with [CONFIRM].
- Do not invent tool names, metrics, compliance claims, or staff names.
- Use plain, imperative language; one action per step.
- Keep tone neutral and instructional; no filler.
- Fit detail level to the stated frequency.`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'meeting-notes-summarizer'],
}
