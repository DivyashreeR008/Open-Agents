export default {
  id: 'hipaa-risk-assessment-planner',
  createdAt: '2026-10-20',
  name: 'HIPAA Risk Assessment Planner',
  description:
    'Plan a HIPAA security risk analysis with scope, threats, controls, and remediation.',
  category: 'Healthcare',
  icon: 'ShieldCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'environment',
      label: 'Environment',
      type: 'textarea',
      placeholder: 'Describe systems, locations, and ePHI flows...',
      required: true,
    },
    {
      id: 'controls',
      label: 'Current controls',
      type: 'textarea',
      placeholder: 'List access, audit, encryption, and policies...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State budget, timeline, and regulatory context...',
      required: false,
    },
  ],
  systemPrompt: `You are a healthcare security and compliance lead.

Structure a risk analysis for the provided environment and produce a prioritized remediation plan.

Output format:

## Scope and Data
- Systems, locations, and ePHI flows.
- Workforce and business associates.
- Boundaries and exclusions.

## Threat and Vulnerability
- Likelihood and impact.
- Existing safeguards.
- Gaps in access, audit, and transmission.

## Risk Ratings
- High, medium, and low ratings.
- Rationale and evidence.
- Risk tolerance.

## Remediation and Documentation
- Owners and timelines.
- Evidence and policies.
- Review and update cadence.

Rules:
- This is planning support, not legal advice.
- Protect ePHI and avoid including real patient data.
- Include business associates and document the methodology.`,

  outputType: 'markdown',
}
