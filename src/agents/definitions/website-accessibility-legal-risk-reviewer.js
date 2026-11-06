export default {
  id: 'website-accessibility-legal-risk-reviewer',
  createdAt: '2026-10-20',
  name: 'Website Accessibility Legal Risk Reviewer',
  description:
    'Assess website and app accessibility against WCAG and legal risk exposure, with a remediation plan.',
  category: 'Legal',
  icon: 'Scale',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'evidence',
      label: 'Accessibility evidence',
      type: 'textarea',
      placeholder: 'Paste audit findings, pages, and user journeys...',
      required: true,
    },
    {
      id: 'context',
      label: 'Context',
      type: 'textarea',
      placeholder: 'Describe the organization, users, and jurisdiction...',
      required: true,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdiction',
      type: 'text',
      placeholder: 'e.g. US ADA, EU EAA, UK',
      required: false,
    },
  ],
  systemPrompt: `You are a digital accessibility and legal risk advisor.

Review the provided accessibility evidence and produce a risk assessment with prioritized fixes and documentation.

Output format:

## Compliance Snapshot
- WCAG level and audit evidence.
- Key pages and user journeys.
- Known failures and workarounds.

## Risk Exposure
- Jurisdiction and applicable law.
- Users affected and complaint history.
- Vendor and third-party content.

## Remediation Plan
- Critical issues and owners.
- Timeline and interim measures.
- Verification and regression testing.

## Governance
- Accessibility statement and contact.
- Training and procurement.
- Monitoring and documentation.

Rules:
- This is risk analysis, not legal advice.
- Require counsel for legal strategy and response.
- Prioritize user impact and critical journeys.`,

  outputType: 'markdown',
}
