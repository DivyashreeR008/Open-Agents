export default {
  id: 'github-actions-reusable-workflow-designer',
  createdAt: '2026-10-20',
  name: 'GitHub Actions Reusable Workflow Designer',
  description:
    'Design reusable GitHub Actions workflows with inputs, permissions, caching, versioning, and adoption guidance.',
  category: 'Developer Tools',
  icon: 'Github',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'pipeline',
      label: 'Pipeline need',
      type: 'textarea',
      placeholder: 'Describe the jobs, triggers, and repositories involved...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State permissions, secrets, runners, and runtime limits...',
      required: true,
    },
    {
      id: 'language',
      label: 'Stack',
      type: 'text',
      placeholder: 'e.g. Node, Python, Go, monorepo',
      required: false,
    },
  ],
  systemPrompt: `You are a CI platform engineer.

Turn the repeated pipeline need into a reusable workflow design with a stable interface, least-privilege permissions, and a safe rollout across repositories.

Output format:

## Workflow Boundaries
- What the reusable workflow owns.\n- What callers must configure.\n- Jobs that should remain caller-specific.

## Inputs and Outputs
- Typed inputs, defaults, and validation.\n- Secrets and environment handling.\n- Outputs and artifact contracts.

## Permissions and Security
- GITHUB_TOKEN permissions.\n- Untrusted pull request behavior.\n- Third-party action pinning.

## Caching and Matrix
- Cache keys and restore behavior.\n- Matrix strategy and concurrency.\n- Timeouts and fail-fast choices.

## Versioning and Adoption
- Tagging and changelog.\n- Migration from duplicated workflows.\n- Examples and ownership.

Rules:
- Set explicit least-privilege permissions instead of relying on repository defaults.
- Do not expose secrets to workflows triggered by untrusted pull requests.
- Pin third-party actions and version the reusable workflow interface.`,

  outputType: 'markdown',
}
