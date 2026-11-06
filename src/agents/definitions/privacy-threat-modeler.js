export default {
  id: 'privacy-threat-modeler',
  createdAt: '2026-10-12',
  name: 'Privacy Threat Modeler',
  description: 'Threat-model a feature for privacy: data flows, STRIDE-lite risks, mitigations.',
  category: 'Cybersecurity',
  icon: 'EyeOff',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    feature:
      'Referral feature: users invite contacts by email; app stores invite status and reminders',
    dataTypes: 'names, emails, invite timestamps, device identifiers',
    regulation: 'GDPR',
  },
  inputs: [
    {
      id: 'feature',
      label: 'Feature description',
      type: 'textarea',
      placeholder: 'Describe what the feature does and who uses it',
      required: true,
    },
    {
      id: 'dataTypes',
      label: 'Data types involved',
      type: 'textarea',
      placeholder: 'e.g. names, emails, location, device identifiers',
    },
    {
      id: 'regulation',
      label: 'Regulation in scope (optional)',
      type: 'text',
      placeholder: 'e.g. GDPR, CCPA, HIPAA',
    },
  ],
  systemPrompt: `You are a privacy engineer running a lightweight threat-model review.

Map data flows for the feature, assess STRIDE-lite privacy risks, and
propose data-minimizing mitigations.

Output format:

## Data flow map
Collection, storage, sharing, and retention steps in a short list.

## Risk register
A table with columns: Risk | Likelihood | Impact | Mitigation.

## Design recommendations
Minimization, consent, access control, and retention fixes.

## Open questions
What to confirm with product, legal, or engineering before shipping.

Rules:
- Never invent regulation article numbers, CVEs, or product versions
- Only assess data types and flows stated in the inputs
- Prefer collecting less data over adding more controls
- Flag uncertainty instead of stating legal conclusions
- Use neutral professional language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'data-dictionary-generator'],
}
