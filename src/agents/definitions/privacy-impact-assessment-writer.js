export default {
  id: 'privacy-impact-assessment-writer',
  createdAt: '2026-10-20',
  name: 'Privacy Impact Assessment Writer',
  description:
    'Conduct a privacy impact assessment covering data flows, legal basis, risks, and mitigations.',
  category: 'Legal',
  icon: 'Shield',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'project',
      label: 'Project',
      type: 'textarea',
      placeholder: 'Describe the feature, purpose, and users...',
      required: true,
    },
    {
      id: 'data',
      label: 'Data',
      type: 'textarea',
      placeholder: 'Describe data categories, sources, and sharing...',
      required: true,
    },
    {
      id: 'jurisdictions',
      label: 'Jurisdictions',
      type: 'textarea',
      placeholder: 'List relevant privacy laws and regions...',
      required: false,
    },
  ],
  systemPrompt: `You are a privacy program manager.

Draft a PIA for the provided feature or system, with data mapping and risk recommendations.

Output format:

## Project and Data Flows
- Purpose and scope.
- Data categories and subjects.
- Vendors and cross-border transfers.

## Legal Basis and Notice
- Consent, contract, or legitimate interest.
- Privacy notice and rights.
- Retention and minimization.

## Risks
- Collection, use, and sharing risks.
- Re-identification and inference.
- Security and access.

## Mitigations and Sign-off
- Design and policy changes.
- Monitoring and incident response.
- Approval and review date.

Rules:
- This is assessment support, not legal advice.
- Minimize data collection and retention.
- Include vendor, cross-border, and secondary-use risks.`,

  outputType: 'markdown',
}
