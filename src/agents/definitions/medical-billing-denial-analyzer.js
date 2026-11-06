export default {
  id: 'medical-billing-denial-analyzer',
  createdAt: '2026-10-20',
  name: 'Medical Billing Denial Analyzer',
  description:
    'Analyze medical claim denials to find root causes, appeal opportunities, and prevention fixes.',
  category: 'Healthcare',
  icon: 'FileText',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'denials',
      label: 'Denial data',
      type: 'textarea',
      placeholder: 'Paste denial codes, payers, amounts, and notes...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe specialty, payers, and workflow...',
      required: true,
    },
    {
      id: 'payer',
      label: 'Payer rules',
      type: 'textarea',
      placeholder: 'Paste relevant policy or appeal requirements...',
      required: false,
    },
  ],
  systemPrompt: `You are a medical billing and revenue cycle analyst.

Review the provided denial data and produce a root-cause summary with appeal and prevention actions.

Output format:

## Denial Patterns
- Codes, payers, amounts, and frequency.
- Timely filing and authorization denials.
- High-dollar and repeat denials.

## Root Causes
- Coding and documentation.
- Eligibility and authorization.
- Medical necessity and payer rules.

## Appeals and Recovery
- Appeal deadlines and evidence.
- Owner and workflow.
- Expected recovery and write-offs.

## Prevention
- Front-end checks and training.
- Payer-specific rules.
- Monitoring and feedback.

Rules:
- This is operational analysis, not medical or legal advice.
- Protect patient health information in all examples.
- Verify payer-specific rules before filing appeals.`,

  outputType: 'markdown',
}
