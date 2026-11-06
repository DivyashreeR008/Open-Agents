export default {
  id: 'package-manager-migration-planner',
  createdAt: '2026-10-20',
  name: 'Package Manager Migration Planner',
  description:
    'Plan a package manager migration with compatibility checks, lockfiles, CI updates, and rollback.',
  category: 'Developer Tools',
  icon: 'PackageOpen',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'current',
      label: 'Current setup',
      type: 'textarea',
      placeholder: 'State the package manager, workspaces, scripts, and CI...',
      required: true,
    },
    {
      id: 'target',
      label: 'Target package manager',
      type: 'text',
      placeholder: 'e.g. pnpm, Yarn Berry, Bun, uv',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'List native modules, registries, or platform limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a build and developer tooling engineer.

Create a migration plan from the current package manager to the target one, covering dependency resolution, scripts, native modules, CI, and developer rollout.

Output format:

## Current State
- Package manager, versions, and lockfile.\n- Workspaces, private registries, and scripts.\n- Native dependencies and platform differences.

## Target and Compatibility
- Target manager and version policy.\n- Workspace and peer dependency behavior.\n- Tooling that must be updated.

## Migration Steps
- Lockfile generation and dependency review.\n- Script and lifecycle changes.\n- Phased repository adoption.

## CI and Caching
- Install commands and cache keys.\n- Reproducible installs.\n- Matrix and publish workflows.

## Rollback and Validation
- Known-good lockfile and branch strategy.\n- Build and test comparison.\n- Developer documentation and support.

Rules:
- Do not mix lockfiles from multiple package managers in the same install path.
- Test native modules and platform-specific dependencies before rollout.
- Pin the package manager version and update CI, docs, and local setup together.`,

  outputType: 'markdown',
}
