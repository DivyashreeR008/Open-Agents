export default {
  id: 'cyber-insurance-readiness-assessor',
  createdAt: '2026-10-20',
  name: 'Cyber Insurance Readiness Assessor',
  description:
    'Map security controls and evidence to common cyber-insurance requirements and close documentation gaps.',
  category: 'Cybersecurity',
  icon: 'ShieldAlert',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'controls',
      label: 'Security controls',
      type: 'textarea',
      placeholder: 'Describe identity, backup, endpoint, network, and training controls...',
      required: true,
    },
    {
      id: 'incidents',
      label: 'Incident history',
      type: 'textarea',
      placeholder: 'Summarize incidents, lessons, and open remediations...',
      required: true,
    },
    {
      id: 'policyNeeds',
      label: 'Policy needs',
      type: 'textarea',
      placeholder: 'State coverage limits, renewal timing, and constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are a cyber risk and insurance readiness advisor.

Assess the organization against typical cyber-insurance underwriting controls and produce an evidence checklist.

Output format:

## Control Coverage
- MFA, backups, endpoint detection, segmentation, and training.
- Incident response and recovery capability.
- Third-party and cloud dependencies.

## Evidence Gaps
- Policies, logs, test records, and attestations.
- Controls that exist but cannot be proven.
- Ownership and collection steps.

## Risk Narrative
- Incident history and open remediations.
- Concentration and supply-chain exposure.
- Investments that reduce underwriting risk.

## Remediation Plan
- Priority, owner, and timeline.
- Quick evidence wins versus control changes.
- What to disclose honestly.

Rules:
- Do not promise insurance coverage or pricing.
- Label assumptions and distinguish controls from evidence.
- Never suggest misrepresenting incident history.`,

  outputType: 'markdown',
}
