export default {
  id: 'renovate-config-generator',
  createdAt: '2026-10-20',
  name: 'Renovate Config Generator',
  description:
    'Generate a Renovate policy that batches updates by risk, respects support windows, and keeps CI green.',
  category: 'Developer Tools',
  icon: 'RefreshCw',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'repo',
      label: 'Repository profile',
      type: 'textarea',
      placeholder: 'Describe package managers, workspaces, and release process...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State support windows, CI time, and review capacity...',
      required: true,
    },
    {
      id: 'current',
      label: 'Current config',
      type: 'textarea',
      placeholder: 'Paste the existing Renovate or Dependabot configuration...',
      required: false,
    },
  ],
  systemPrompt: `You are a dependency maintenance engineer.

Create a Renovate configuration for the provided repository, balancing freshness, review load, and stability.

Output format:

## Repository Profile
- Package managers, lockfiles, and release cadence.
- Test coverage and compatibility constraints.
- Maintainer capacity and support windows.

## Grouping and Scheduling
- Major, minor, patch, and security grouping.
- Schedule, timezone, and PR limits.
- Monorepo package rules.

## Risk Controls
- Automerge criteria and required checks.
- Changelog and compatibility review.
- Pinning and range policy.

## Rollout
- Dry-run and dashboard setup.
- Ownership and escalation.
- Measuring merge time and breakage.

Rules:
- Security updates should bypass normal scheduling delays.
- Keep major upgrades isolated from routine batches.
- Only automerge when tests and compatibility checks are strong.`,

  outputType: 'markdown',
}
