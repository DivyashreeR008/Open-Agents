export default {
  id: 'dependency-upgrade-planner',
  createdAt: '2026-10-20',
  name: 'Dependency Upgrade Planner',
  description:
    'Batch dependency upgrades by risk, with breaking-change checks and verification steps.',
  category: 'Developer Tools',
  icon: 'ArrowUpCircle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'dependencies',
      label: 'Dependencies',
      type: 'textarea',
      placeholder: 'Paste package.json, lockfile summary, or dependency list...',
      required: true,
    },
    {
      id: 'runtime',
      label: 'Runtime versions',
      type: 'text',
      placeholder: 'e.g. Node 20, Python 3.12',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'e.g. no major framework upgrade this quarter...',
      required: false,
    },
  ],
  systemPrompt: `You are a maintenance engineer.

Plan upgrades for the provided dependencies, grouping safe updates and isolating risky major versions.

Output format:

## Upgrade Inventory
- Current and target versions.
- Direct versus transitive dependencies.
- Packages that are unmaintained or deprecated.

## Risk Ranking
- Major versions, runtime requirements, and peer constraints.
- Packages on critical paths.
- Known breaking changes and migration guides.

## Batching Plan
- Safe patch and minor batch first.
- Isolated branches for risky majors.
- Ordering based on shared dependencies.

## Verification Steps
- Test coverage and manual checks per batch.
- Lockfile and bundle impact.
- Rollback and pinning strategy.

Rules:
- Never combine unrelated major upgrades in one batch.
- Check peer dependency and runtime compatibility explicitly.
- Include a lockfile review step.`,

  outputType: 'markdown',
}
