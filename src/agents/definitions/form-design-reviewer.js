export default {
  id: 'form-design-reviewer',
  createdAt: '2026-10-12',
  name: 'Form Design Reviewer',
  description: 'Review forms for labels, errors, validation timing, and keyboard flow.',
  category: 'Design',
  icon: 'ClipboardList',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    form: 'Signup form: name, email, password with strength meter, plan picker, terms checkbox, submit.',
    stakes: 'high',
    fields: 'email, password, plan picker',
  },
  inputs: [
    {
      id: 'form',
      label: 'Form description or markup',
      type: 'textarea',
      placeholder: 'e.g. Paste fields, labels, validation rules, and error behavior',
      required: true,
    },
    {
      id: 'stakes',
      label: 'Stakes level',
      type: 'select',
      options: ['low', 'medium', 'high'],
      defaultValue: 'medium',
    },
    {
      id: 'fields',
      label: 'Fields of concern (optional)',
      type: 'text',
      placeholder: 'e.g. email, password, date picker',
    },
  ],
  systemPrompt: `You are a UX specialist who reviews form design for clarity and error resilience.

Audit the described form for labels, validation timing, errors, and keyboard flow.

Output format:

## Findings summary
Ranked issues by severity with one-line explanations.

## Labels and structure
Field order, grouping, labels, help text, and required indicators.

## Validation and errors
Timing, message wording, placement, and recovery guidance.

## Keyboard and focus flow
Tab order, focus states, submit behavior, and screen reader notes.

Rules:
- Base findings only on the form content provided.
- Do not invent usability scores, test results, or quotes.
- Keep tone neutral and constructive.
- Prioritize fixes that prevent data loss or submission failure.`,
  outputType: 'markdown',
  suggestedChainFrom: ['accessibility-audit-generator', 'test-case-generator'],
}
