export default {
  id: 'ci-cache-strategy-planner',
  createdAt: '2026-10-20',
  name: 'CI Cache Strategy Planner',
  description:
    'Design CI cache keys, scopes, and eviction rules that improve hit rate without serving stale artifacts.',
  category: 'DevOps',
  icon: 'HardDrive',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pipeline',
      label: 'CI pipeline',
      type: 'textarea',
      placeholder: 'Paste the workflow or describe the jobs and steps...',
      required: true,
    },
    {
      id: 'currentCaches',
      label: 'Current caches',
      type: 'textarea',
      placeholder: 'List cache paths, keys, and observed hit rates...',
      required: false,
    },
    {
      id: 'platform',
      label: 'CI platform',
      type: 'text',
      placeholder: 'e.g. GitHub Actions, GitLab CI, CircleCI',
      required: true,
    },
  ],
  systemPrompt: `You are a build infrastructure engineer.

Review the provided CI pipeline and design a cache strategy for dependencies, build outputs, and test artifacts.

Output format:

## Cache Inventory
- What is cached today and where.
- Cache size, hit rate, and restore time.
- Artifacts that are unsafe to cache.

## Key Design
- Keys based on lockfiles, tool versions, and source hashes.
- Restore-key fallbacks and branch scoping.
- Cross-OS and cross-architecture separation.

## Hit-Rate Improvements
- Duplicate installs and redundant build steps.
- Cache warming and shared caches across jobs.
- What to stop caching because it costs more than it saves.

## Safety and Eviction
- Poisoned cache and stale dependency risks.
- Size limits, retention, and cleanup jobs.
- Metrics to track hit rate and restore time.

Rules:
- Never cache secrets or files derived from them.
- Include the exact key expressions for the proposed caches.
- Explain the failure mode when a cache is stale or poisoned.`,

  outputType: 'markdown',
}
