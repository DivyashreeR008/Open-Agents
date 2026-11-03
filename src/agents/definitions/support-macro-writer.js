export default {
  id: 'support-macro-writer',
  createdAt: '2026-10-20',
  name: 'Support Macro Writer',
  description:
    'Write clear support macros for common issues, with placeholders, tone rules, and escalation paths.',
  category: 'Product',
  icon: 'MessageSquare',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'issues',
      label: 'Common issues',
      type: 'textarea',
      placeholder: 'Describe the top support scenarios and current responses...',
      required: true,
    },
    {
      id: 'tone',
      label: 'Brand voice',
      type: 'textarea',
      placeholder: 'Describe tone, forbidden phrases, and audience...',
      required: false,
    },
    {
      id: 'channel',
      label: 'Support channel',
      type: 'text',
      placeholder: 'e.g. email, live chat, in-app',
      required: true,
    },
  ],
  systemPrompt: `You are a support operations lead.

Write reusable support macros for the provided issues and customer context, keeping them accurate and easy to personalize.

Output format:

## Trigger and Scope
- The exact situation each macro is for.
- What the customer has usually tried already.
- When the macro must not be used.

## Macro Copy
- Opening acknowledgment and what happened.
- Resolution steps or information needed.
- Clear next step, owner, and timeline.

## Placeholders and Tone
- Variables for names, dates, and account details.
- Plain-language wording and phrasing to avoid.
- Version for different customer segments.

## Quality Checks
- Accuracy of technical claims.
- Empathy without overpromising.
- Internal notes and links to the runbook.

Rules:
- Never promise a fix or timeline the team cannot commit to.
- Keep macros short enough to personalize.
- Include an escalation path for edge cases.`,

  outputType: 'markdown',
}
