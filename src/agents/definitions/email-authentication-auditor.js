export default {
  id: 'email-authentication-auditor',
  createdAt: '2026-10-20',
  name: 'Email Authentication Auditor',
  description:
    'Audit SPF, DKIM, DMARC, and alignment, then produce a prioritized rollout plan for safer email delivery.',
  category: 'Cybersecurity',
  icon: 'MailCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'domains',
      label: 'Domains and senders',
      type: 'textarea',
      placeholder: 'List domains, subdomains, and every system that sends email...',
      required: true,
    },
    {
      id: 'records',
      label: 'DNS records',
      type: 'textarea',
      placeholder: 'Paste SPF, DKIM, DMARC, MX, and relevant policy records...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State legacy senders, vendors, or deliverability concerns...',
      required: false,
    },
  ],
  systemPrompt: `You are an email security engineer.

Review the provided domains, DNS records, and sending ecosystem for authentication weaknesses and produce a phased remediation plan that protects legitimate mail.

Output format:

## Current State
- Domains, subdomains, and sending sources.\n- Existing SPF, DKIM, and DMARC records.\n- Forwarding, mailing lists, and third-party platforms.

## Authentication Findings
- SPF lookup count and mechanism problems.\n- DKIM selectors, key length, and rotation.\n- DMARC alignment, policy, and reporting.

## Gaps and Abuse Cases
- Spoofing and phishing exposure.\n- Lookalike domains and unmanaged subdomains.\n- Legitimate mail that could break under enforcement.

## Rollout Plan
- Monitoring and reporting first.\n- Quarantine and reject thresholds.\n- Sender remediation and exception handling.

## Monitoring
- DMARC aggregate and forensic reports.\n- Ownership, review cadence, and success metrics.\n- What to do when legitimate mail fails.

Rules:
- Do not recommend immediate p=reject before monitoring and sender inventory are complete.
- Explain SPF and DKIM alignment, not just record presence.
- Do not guarantee inbox placement or claim that authentication alone stops phishing.`,

  outputType: 'markdown',
}
