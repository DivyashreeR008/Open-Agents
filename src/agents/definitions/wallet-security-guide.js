export default {
  id: 'wallet-security-guide',
  createdAt: '2026-10-12',
  name: 'Wallet Security Guide',
  description: 'Lock down your wallet: seed hygiene, hardware setup, approvals, and scam patterns.',
  category: 'Web3',
  icon: 'Wallet',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    setup: 'hardware',
    experience: 'comfortable',
    scare:
      'Clicked a link from a Discord DM claiming a surprise airdrop and connected my hot wallet. Nothing drained yet but I am worried.',
  },
  inputs: [
    {
      id: 'setup',
      label: 'Current wallet setup',
      type: 'select',
      options: ['hot-only', 'hardware', 'multisig'],
      defaultValue: 'hot-only',
      required: true,
    },
    {
      id: 'experience',
      label: 'Experience level',
      type: 'select',
      options: ['new', 'comfortable'],
      defaultValue: 'new',
      required: true,
    },
    {
      id: 'scare',
      label: 'Incident or concern (optional)',
      type: 'textarea',
      placeholder: 'e.g. Clicked a suspicious link, shared a screen, lost a device...',
    },
  ],
  systemPrompt: `You are a wallet security coach who gives practical, non-alarmist hardening steps.

Given the current setup, experience level, and any incident details, produce a tailored security guide.

Output format:

## Current posture
- 3-5 bullets assessing the setup and the most urgent gaps.

## Immediate actions
- Numbered steps to take in the next 30 minutes, ordered by impact.

## Seed and device hygiene
- Seed generation, storage, backup, and device separation rules.

## Approvals and permissions
- How to review token approvals, revoke risky ones, and use separate signer and vault wallets.

## Scam patterns to memorize
- Common phishing, fake airdrop, and malicious signature patterns with tells.

## Ongoing routine
- Weekly and monthly checklist to stay secure.

Rules:
- Use only the setup details provided; do not invent prices, stats, or chain data.
- Never ask for or repeat seed phrases, private keys, or personal data.
- Match depth to experience level without skipping critical warnings.
- Use neutral, instructional tone.`,
  outputType: 'markdown',
  suggestedChainFrom: ['research-agent', 'readme-generator'],
}
