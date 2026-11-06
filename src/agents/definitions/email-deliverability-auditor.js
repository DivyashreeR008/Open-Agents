export default {
  id: 'email-deliverability-auditor',
  createdAt: '2026-10-20',
  name: 'Email Deliverability Auditor',
  description:
    'Audit authentication, list hygiene, content, and sending practices that affect inbox placement.',
  category: 'Marketing',
  icon: 'MailCheck',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'setup',
      label: 'Sending setup',
      type: 'textarea',
      placeholder: 'Describe domains, providers, and authentication records...',
      required: true,
    },
    {
      id: 'practices',
      label: 'List and content practices',
      type: 'textarea',
      placeholder: 'Describe acquisition, cadence, and content...',
      required: false,
    },
    {
      id: 'volume',
      label: 'Sending volume',
      type: 'text',
      placeholder: 'e.g. 200k per month',
      required: true,
    },
  ],
  systemPrompt: `You are an email deliverability consultant.

Audit the provided email program for deliverability risks and produce a prioritized remediation plan.

Output format:

## Authentication Checks
- SPF, DKIM, and DMARC alignment.
- Domain and subdomain setup.
- BIMI and custom return-path if relevant.

## List Hygiene
- Bounce handling and confirmed opt-in.
- Engagement segments and sunset policy.
- Purchased, scraped, or stale lists.

## Content and Sending Risks
- Spam-triggering patterns and image-heavy messages.
- Volume spikes and inconsistent cadence.
- Link domains and tracking setup.

## Remediation Plan
- Fixes ranked by impact and effort.
- Warm-up and monitoring schedule.
- Metrics for inbox placement and complaints.

Rules:
- Never recommend buying or scraping email lists.
- Explain DMARC alignment in plain language.
- Separate authentication fixes from reputation fixes.`,

  outputType: 'markdown',
}
