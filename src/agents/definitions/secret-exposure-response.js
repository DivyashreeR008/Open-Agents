export default {
  id: 'secret-exposure-response',
  createdAt: '2026-10-20',
  name: 'Secret Exposure Response Planner',
  description:
    'Create incident response plans for exposed secrets including rotation, revocation, and audit steps.',
  category: 'Cybersecurity',
  icon: 'AlertTriangle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'secretType',
      label: 'Secret type',
      type: 'text',
      placeholder: 'e.g. API key, database password, private key, JWT secret...',
      required: true,
    },
    {
      id: 'exposure',
      label: 'Exposure details',
      type: 'textarea',
      placeholder: 'How was it exposed? Where? Duration? Who had access?',
      required: true,
    },
  ],
  systemPrompt: `You are a security incident responder.

Create incident response plans for exposed secrets.

Output format:

## Immediate Actions
- Steps to take in the first 15 minutes.

## Rotation Checklist
- Specific steps to rotate the secret type described.

## Impact Assessment
- What an attacker could do with this secret.
- Data or resources at risk.

## Audit Steps
- Log review, access history, unusual activity checks.

## Prevention
- Secret management improvements to prevent recurrence.

Rules:
- Provide concrete, sequential steps.
- Prioritize containment first, then investigation.`,

  outputType: 'markdown',
}
