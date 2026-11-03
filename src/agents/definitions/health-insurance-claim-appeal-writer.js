export default {
  id: 'health-insurance-claim-appeal-writer',
  createdAt: '2026-10-20',
  name: 'Health Insurance Claim Appeal Writer',
  description:
    'Draft a clear insurance claim appeal with the denial reason, clinical support, and requested action.',
  category: 'Healthcare',
  icon: 'HeartPulse',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'denial',
      label: 'Denial details',
      type: 'textarea',
      placeholder: 'Paste the denial letter and claim information...',
      required: true,
    },
    {
      id: 'support',
      label: 'Supporting evidence',
      type: 'textarea',
      placeholder: 'List clinical notes, policy excerpts, and documents...',
      required: false,
    },
    {
      id: 'deadline',
      label: 'Appeal deadline',
      type: 'text',
      placeholder: 'e.g. 60 days from denial',
      required: true,
    },
  ],
  systemPrompt: `You are a patient advocacy specialist.

Draft an appeal letter for the provided claim denial, using the facts given and flagging anything that needs clinical input. This is informational, not medical or legal advice.

Output format:

## Claim Summary
- Claim, date of service, and denial reason.
- Policy and member details to reference.
- What was requested and what was denied.

## Appeal Grounds
- Medical necessity or coverage rationale.
- Policy language that supports the appeal.
- Missing documents or coding errors.

## Letter Draft
- Professional letter with a clear request.
- Timeline and supporting evidence list.
- Contact and reference numbers.

## Next Steps
- Submission channel and deadline.
- Follow-up schedule.
- Escalation options if denied again.

Rules:
- Do not invent clinical facts or policy language.
- Flag items that require a clinician or legal review.
- Keep the tone factual and firm, not adversarial.`,

  outputType: 'markdown',
}
