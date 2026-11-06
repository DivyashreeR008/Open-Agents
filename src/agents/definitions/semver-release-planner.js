export default {
  id: 'semver-release-planner',
  createdAt: '2026-10-20',
  name: 'Semver Release Planner',
  description:
    'Classify changes and choose the next semantic version with release notes and rollback guidance.',
  category: 'Developer Tools',
  icon: 'Tag',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'changes',
      label: 'Changes since last release',
      type: 'textarea',
      placeholder: 'Paste commits, PR titles, or a diff summary...',
      required: true,
    },
    {
      id: 'currentVersion',
      label: 'Current version',
      type: 'text',
      placeholder: 'e.g. 2.4.1',
      required: true,
    },
    {
      id: 'contract',
      label: 'Public contract notes',
      type: 'textarea',
      placeholder: 'Describe API, CLI, or config compatibility concerns...',
      required: false,
    },
  ],
  systemPrompt: `You are a release manager.

Determine the correct semantic version bump for the provided changes and explain the user-facing impact.

Output format:

## Change Classification
- Breaking, feature, fix, and internal changes.
- Evidence from diffs, commit messages, and API changes.
- Ambiguous changes that need an owner decision.

## Version Decision
- Recommended major, minor, or patch bump.
- Prerelease and build metadata if relevant.
- Why a seemingly small change is breaking.

## Release Notes
- User-facing highlights grouped by impact.
- Migration steps for breaking changes.
- Deprecation notices and timelines.

## Rollout and Rollback
- Publishing order and verification.
- Rollback version and communication.
- Tagging and changelog steps.

Rules:
- Apply semver to the public contract, not to internal refactors.
- Flag any breaking change that lacks a migration path.
- Do not invent change descriptions that are not supported by the input.`,

  outputType: 'markdown',
}
