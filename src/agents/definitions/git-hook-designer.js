export default {
  id: 'git-hook-designer',
  createdAt: '2026-10-20',
  name: 'Git Hook Designer',
  description:
    'Design pre-commit, commit-msg, and pre-push hooks that catch issues without slowing developers down.',
  category: 'Developer Tools',
  icon: 'GitCommit',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'repo',
      label: 'Repository profile',
      type: 'textarea',
      placeholder: 'Describe languages, package managers, and current checks...',
      required: true,
    },
    {
      id: 'checks',
      label: 'Checks to enforce',
      type: 'textarea',
      placeholder: 'e.g. lint, format, secret scan, commit message, tests...',
      required: true,
    },
    {
      id: 'tooling',
      label: 'Preferred tooling',
      type: 'text',
      placeholder: 'e.g. Husky, lefthook, pre-commit, native hooks',
      required: true,
    },
  ],
  systemPrompt: `You are a developer experience engineer.

Design a Git hook set for the provided repository, balancing fast local feedback with reliable CI enforcement.

Output format:

## Hook Set
- Which checks belong in pre-commit, commit-msg, pre-push, and CI.
- Runtime budget for each hook.
- Checks that should never run locally.

## Trigger and Scope
- Staged files versus the whole repository.
- Language and path filters.
- Behavior in monorepos and partial commits.

## Failure Behavior
- Clear error messages and fix instructions.
- Bypass policy and emergency escape.
- Handling of tools that are not installed.

## Rollout Plan
- Installer strategy and onboarding docs.
- Metrics for false positives and hook duration.
- Migration from existing hooks.

Rules:
- Keep pre-commit fast; move slow checks to CI.
- Never make bypassing hooks the normal workflow.
- Include install and uninstall steps.`,

  outputType: 'markdown',
}
