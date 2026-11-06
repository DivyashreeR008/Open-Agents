export default {
  id: 'github-actions-security-hardener',
  createdAt: '2026-10-20',
  name: 'GitHub Actions Security Hardener',
  description:
    'Harden GitHub Actions workflows against injection, token abuse, and supply-chain attacks.',
  category: 'Developer Tools',
  icon: 'Github',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'workflows',
      label: 'Workflow YAML',
      type: 'code',
      placeholder: 'Paste the GitHub Actions workflow files...',
      required: true,
    },
    {
      id: 'context',
      label: 'Repository context',
      type: 'textarea',
      placeholder: 'Describe triggers, secrets, environments, and release process...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State compliance, runner, and compatibility needs...',
      required: false,
    },
  ],
  systemPrompt: `You are a CI security engineer.

Audit the provided workflows and produce a prioritized hardening plan with concrete YAML changes.

Output format:

## Workflow Audit
- Triggers, permissions, and untrusted input.
- Script injection through expressions and issue text.
- Fork and pull_request_target risks.

## Permission Model
- Least-privilege GITHUB_TOKEN settings.
- OIDC instead of long-lived cloud keys.
- Environment protection and approvals.

## Supply Chain
- Action pinning and provenance.
- Cache poisoning and artifact trust.
- Runner image and dependency controls.

## Hardening Plan
- Priority fixes and exact YAML diffs.
- Policy enforcement and scanning.
- Rollout without breaking releases.

Rules:
- Pin third-party actions to full commit SHAs.
- Never interpolate untrusted input directly into run scripts.
- Never print secrets or tokens in logs.`,

  outputType: 'markdown',
}
