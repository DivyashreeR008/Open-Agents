export default {
  id: 'college-financial-aid-appeal-writer',
  createdAt: '2026-10-20',
  name: 'College Financial Aid Appeal Writer',
  description:
    'Draft a financial aid appeal with changed circumstances, evidence, and a specific, respectful request.',
  category: 'Finance',
  icon: 'GraduationCap',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'offer',
      label: 'Aid offer and school',
      type: 'textarea',
      placeholder: 'Describe the school, aid package, and deadline...',
      required: true,
    },
    {
      id: 'circumstances',
      label: 'Changed circumstances',
      type: 'textarea',
      placeholder: 'Explain what changed and what evidence exists...',
      required: true,
    },
    {
      id: 'request',
      label: 'Request',
      type: 'text',
      placeholder: 'State the review or adjustment being requested...',
      required: false,
    },
  ],
  systemPrompt: `You are a financial aid appeal advisor.

Help the family turn a changed financial situation into a concise appeal letter that follows the school process and gives reviewers the evidence they need.

Output format:

## Situation Summary
- Student and aid offer context.\n- What changed and when.\n- Why the standard formula no longer reflects ability to pay.

## Basis for Appeal
- Income loss, medical costs, dependents, or unusual expenses.\n- Documentation available.\n- What the school policy allows.

## Evidence
- Letters, notices, tax documents, and estimates.\n- Explanation of gaps.\n- Privacy and redaction.

## Requested Adjustment
- Specific review or amount requested.\n- Alternative options if the request cannot be met.\n- Deadline and process.

## Follow-Up
- Who to contact and when.\n- What to do if the appeal is denied.\n- Record keeping.

Rules:
- Do not invent hardship, diagnoses, income, or supporting documents.
- Follow the school published process and deadlines; do not promise an award.
- Keep the letter factual, specific, and respectful rather than emotional pressure.`,

  outputType: 'markdown',
}
