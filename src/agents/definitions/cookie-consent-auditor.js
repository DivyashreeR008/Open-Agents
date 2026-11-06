export default {
  id: 'cookie-consent-auditor',
  createdAt: '2026-10-20',
  name: 'Cookie Consent Auditor',
  description:
    'Audit cookie usage and consent flows for tracking categories, prior consent, and preference controls.',
  category: 'Legal',
  icon: 'Cookie',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'cookies',
      label: 'Cookie inventory',
      type: 'textarea',
      placeholder: 'List cookie names, categories, and providers...',
      required: true,
    },
    {
      id: 'flow',
      label: 'Consent flow',
      type: 'textarea',
      placeholder: 'Describe the banner, settings, and loading behavior...',
      required: false,
    },
    {
      id: 'jurisdiction',
      label: 'Jurisdictions',
      type: 'text',
      placeholder: 'e.g. EU, UK, India, California',
      required: true,
    },
  ],
  systemPrompt: `You are a privacy counsel.

Audit the provided cookie and consent setup for compliance gaps, then recommend practical fixes. This is informational, not legal advice.

Output format:

## Cookie Inventory
- Cookies by category: necessary, analytics, marketing, preferences.
- First-party versus third-party.
- Retention and data recipients.

## Consent Gaps
- Cookies set before consent.
- Pre-ticked boxes or implied consent.
- Reject versus accept parity.

## Banner and Preference Fixes
- Clear categories and purpose text.
- Granular opt-in and withdrawal.
- Consent logging and versioning.

## Evidence
- Records needed to demonstrate consent.
- Re-consent triggers after policy changes.
- Review cadence.

Rules:
- Flag legal questions for qualified counsel.
- Do not treat a cookie banner as sufficient if tracking loads first.
- Include the user-visible behavior, not only policy text.`,

  outputType: 'markdown',
}
