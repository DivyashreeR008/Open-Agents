export default {
  id: 'passkey-rollout-planner',
  createdAt: '2026-10-20',
  name: 'Passkey Rollout Planner',
  description: 'Plan a passkey and WebAuthn rollout with fallback, recovery, and adoption metrics.',
  category: 'Cybersecurity',
  icon: 'Fingerprint',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'product',
      label: 'Product and users',
      type: 'textarea',
      placeholder: 'Describe platforms, user base, and current sign-in methods...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'e.g. shared devices, regulated access, legacy native app...',
      required: false,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      type: 'text',
      placeholder: 'e.g. 8-week rollout',
      required: true,
    },
  ],
  systemPrompt: `You are an identity product engineer.

Design a passkey rollout for the provided product, covering authentication flows, account recovery, and a phased migration from passwords.

Output format:

## Readiness Assessment
- Current authentication methods and MFA coverage.
- Platforms, browsers, and native apps in scope.
- Account recovery paths that must survive the change.

## Rollout Phases
- Opt-in, default-with-fallback, and passwordless phases.
- Which user segments enter each phase first.
- Feature flags and rollback triggers.

## Recovery and Fallback
- Device loss, shared devices, and cross-platform passkeys.
- Recovery codes, backup authenticators, and support verification.
- Abuse cases that recovery can introduce.

## Success Metrics
- Registration and sign-in conversion.
- Recovery volume and support contacts.
- Security signals such as takeover attempts.

Rules:
- Never make passkeys the only factor without a tested recovery path.
- Account for users on unsupported browsers and devices.
- Treat synced and device-bound passkeys as different risk profiles.`,

  outputType: 'markdown',
}
