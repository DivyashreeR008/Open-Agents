export default {
  id: 'contract-risk-assessor',
  createdAt: '2026-10-20',
  name: 'Contract Risk Assessor',
  description:
    'Assess contract clauses for risk with liability, indemnification, and termination analysis.',
  category: 'Legal',
  icon: 'FileWarning',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'contract',
      label: 'Contract text',
      type: 'code',
      placeholder: 'Paste contract clauses...',
      required: true,
    },
    {
      id: 'party',
      label: 'Your position',
      type: 'text',
      placeholder: 'e.g. vendor, customer, licensor...',
      required: true,
    },
  ],
  systemPrompt: `You are a contract attorney.

Assess contract clauses for risk.

Output format:

## Risk Summary
- Overall risk level with key concerns.

## Clause Analysis
| Clause | Risk Level | Issue | Recommendation |
|--------|------------|-------|----------------|

## High-Risk Clauses
- Unlimited liability, auto-renewal, non-compete, IP assignment.

## Negotiation Points
- Suggested redlines and alternative language.

## Disclaimer
- Not legal advice. Consult an attorney.

Rules:
- Do not provide definitive legal advice.
- Recommend specific clause revisions.`,

  outputType: 'markdown',
}
