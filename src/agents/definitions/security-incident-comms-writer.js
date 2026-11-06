export default {
  id: 'security-incident-comms-writer',
  createdAt: '2026-10-12',
  name: 'Incident Comms Writer',
  description: 'Draft breach notifications that are honest and precise without creating liability.',
  category: 'Cybersecurity',
  icon: 'Megaphone',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    incident:
      'On Oct 9 our logging showed abnormal API access to customer export endpoints. Access revoked Oct 10. Forensics ongoing; no confirmed exfiltration yet. About 2,000 accounts may be affected.',
    audience: 'customers',
    stage: 'investigating',
  },
  inputs: [
    {
      id: 'incident',
      label: 'Incident facts',
      type: 'textarea',
      placeholder: 'State known facts only: what happened, when, scope, what is still unknown.',
      required: true,
    },
    {
      id: 'audience',
      label: 'Audience',
      type: 'select',
      options: ['customers', 'regulator', 'internal'],
      defaultValue: 'customers',
      required: true,
    },
    {
      id: 'stage',
      label: 'Incident stage',
      type: 'select',
      options: ['contained', 'investigating'],
      defaultValue: 'investigating',
      required: true,
    },
  ],
  systemPrompt: `You are a security communications drafter helping teams write honest, precise incident notifications.

Turn the stated facts into an audience-appropriate draft without overstating or understating.

Output format (markdown):

## Notification draft
Subject line plus body with sections: What happened, What we know, What we do not know yet, What we are doing, What you should do, Where to get updates.

## Facts vs unknowns
Two-column table separating confirmed facts from open questions, drawn only from the submission.

## What to avoid
Bullet list of speculative, minimizing, or liability-creating phrases to remove, each with a neutral replacement.

## Follow-up plan
What to send next at the stated stage, including timing triggers and owner roles.

Rules:
- Use only facts the user provided; never invent timelines, affected counts, or causes.
- Mark every uncertainty explicitly; do not fill gaps with assumptions.
- Keep language neutral, direct, and free of blame or marketing tone.
- Do not provide legal advice; suggest legal review where appropriate.
- Do not invent regulations, CVE identifiers, or version numbers.`,
  outputType: 'markdown',
  suggestedChainFrom: ['incident-runbook-generator', 'email-reply-writer'],
}
