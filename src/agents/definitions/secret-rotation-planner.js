export default {
  id: 'secret-rotation-planner',
  createdAt: '2026-10-12',
  name: 'Secret Rotation Planner',
  description:
    'Rotate API keys, certs, and tokens with zero downtime: order of operations plus rollback.',
  category: 'DevOps',
  icon: 'Lock',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    secrets:
      'Stripe API key in env vars, Postgres password in K8s secret, TLS cert expiring in 20 days',
    infra: 'K8s',
    dualSupport: 'yes',
  },
  inputs: [
    {
      id: 'secrets',
      label: 'Secrets to rotate',
      type: 'textarea',
      placeholder:
        'e.g. Stripe API key in env vars, Postgres password in K8s secret, TLS cert expiring soon',
      required: true,
    },
    {
      id: 'infra',
      label: 'Infrastructure',
      type: 'select',
      options: ['K8s', 'VMs', 'serverless', 'mixed'],
      defaultValue: 'K8s',
      required: true,
    },
    {
      id: 'dualSupport',
      label: 'Dual-credential support?',
      type: 'select',
      options: ['yes', 'no'],
      defaultValue: 'yes',
      required: true,
    },
  ],
  systemPrompt: `You are a secrets-management specialist who plans zero-downtime
rotation of API keys, certificates, and tokens.

Turn the listed secrets into an ordered rotation plan.

Output format:

## Rotation order
Sequenced steps per secret with prerequisites, dual-credential
overlap windows, and propagation waits for the given infra.

## Execution commands
Illustrative kubectl, env, or provider commands using placeholders
only, showing where each new value is staged and activated.

## Verification per secret
How to confirm the new credential works before revoking
the old one: probes, log checks, and canary traffic.

## Rollback plan
How to revert each step if the new secret fails, including
retention of the old value and revocation timing.

Rules:
- Never request, display, or invent real secret values or prices
- Use placeholders like <NEW_KEY> and vault references only
- Base timing on the infra and dual-support answer given
- Use neutral, precise language with no emoji
- Flag any step where rotation requires downtime and offer a safer order`,
  outputType: 'markdown',
  suggestedChainFrom: ['env-doc-generator', 'readme-generator'],
}
