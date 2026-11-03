export default {
  id: 'insider-threat-program-planner',
  createdAt: '2026-10-20',
  name: 'Insider Threat Program Planner',
  description:
    'Design an insider threat program with risk signals, privacy safeguards, investigation, and response.',
  category: 'Cybersecurity',
  icon: 'UserX',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'organization',
      label: 'Organization',
      type: 'textarea',
      placeholder: 'Describe size, roles, access, and sensitive data...',
      required: true,
    },
    {
      id: 'risks',
      label: 'Risk scenarios',
      type: 'textarea',
      placeholder: 'List the insider risks and current concerns...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State privacy, labor, and legal constraints...',
      required: false,
    },
  ],
  systemPrompt: `You are an insider threat program manager.

Build a proportionate insider threat program for the provided organization, respecting privacy and employment law.

Output format:

## Risk Scenarios
- Data theft, sabotage, fraud, and unintentional exposure.\n- High-risk roles and access.\n- Behavioral and technical indicators.

## Signals and Governance
- HR, security, legal, and manager roles.\n- Monitoring boundaries and privacy safeguards.\n- Case intake and confidentiality.

## Investigation and Response
- Triage and evidence standards.\n- Employee rights and interviews.\n- Escalation and law enforcement thresholds.

## Prevention and Culture
- Access reviews and offboarding.\n- Training and reporting channels.\n- Program metrics and review.

Rules:
- This is program design, not legal advice.
- Avoid mass surveillance and respect employee privacy.
- Require documented case handling and proportionality.`,

  outputType: 'markdown',
}
