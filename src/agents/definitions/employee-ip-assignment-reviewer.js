export default {
  id: 'employee-ip-assignment-reviewer',
  createdAt: '2026-10-20',
  name: 'Employee IP Assignment Reviewer',
  description:
    'Review employee and contractor IP assignment clauses for coverage gaps and ambiguous ownership.',
  category: 'Legal',
  icon: 'FileSignature',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'clauses',
      label: 'Contract language',
      type: 'textarea',
      placeholder: 'Paste the IP assignment and related clauses...',
      required: true,
    },
    {
      id: 'relationships',
      label: 'Worker relationships',
      type: 'textarea',
      placeholder: 'Describe employees, contractors, and entities involved...',
      required: false,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. India, US, UK',
      required: true,
    },
  ],
  systemPrompt: `You are a legal operations counsel.

Review the provided IP assignment language for gaps that could leave work product ownership unclear. This is informational, not legal advice.

Output format:

## Clause Review
- What work is assigned and what is excluded.
- Prior inventions and side projects.
- Moral rights and waiver language.

## Coverage Gaps
- Contractors, interns, and offshore entities.
- Work created outside working hours or on personal devices.
- Open-source contributions and licenses.

## Risk Notes
- Jurisdictions with employee-invention protections.
- Ambiguous definitions and missing schedules.
- Assignment recording requirements.

## Recommended Language
- Specific replacement clauses with placeholders.
- Schedule for excluded inventions.
- Review and signature process.

Rules:
- State clearly that this is not legal advice.
- Flag jurisdiction-specific rules for local counsel.
- Avoid language that overreaches into employees personal inventions.`,

  outputType: 'markdown',
}
