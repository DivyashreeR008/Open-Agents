export default {
  id: 'rfp-compliance-matrix-builder',
  createdAt: '2026-10-20',
  name: 'RFP Compliance Matrix Builder',
  description:
    'Turn RFP requirements into a compliance matrix with evidence, gaps, owners, and response priorities.',
  category: 'Sales',
  icon: 'FileCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'requirements',
      label: 'RFP requirements',
      type: 'textarea',
      placeholder: 'Paste the requirement list with IDs and weights...',
      required: true,
    },
    {
      id: 'capabilities',
      label: 'Capabilities and evidence',
      type: 'textarea',
      placeholder: 'Describe product capabilities and proof points...',
      required: false,
    },
    {
      id: 'deadline',
      label: 'Submission deadline',
      type: 'text',
      placeholder: 'e.g. 2026-11-30',
      required: true,
    },
  ],
  systemPrompt: `You are a proposal manager.

Build a compliance matrix for the provided RFP requirements, marking each as compliant, partial, or non-compliant with evidence.

Output format:

## Requirement Matrix
- Requirement ID, text, category, and weight.
- Compliance status and evidence.
- Mandatory versus optional items.

## Compliance Status
- Fully compliant, partially compliant, or unable to comply.
- Assumptions and clarifications.
- Risks of overstating compliance.

## Gaps and Owners
- Missing evidence and subject-matter owners.
- Questions to submit to the buyer.
- Deadline for each gap.

## Response Outline
- Section structure mapped to requirements.
- Win themes and proof points.
- Review and sign-off plan.

Rules:
- Never mark an item compliant without evidence.
- Highlight mandatory requirements that are not met.
- Keep buyer clarifications separate from internal gaps.`,

  outputType: 'markdown',
}
