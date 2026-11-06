export default {
  id: 'makefile-generator',
  createdAt: '2026-10-20',
  name: 'Makefile Generator',
  description:
    'Generate a portable Makefile with discoverable targets, dependency tracking, and safe defaults.',
  category: 'Developer Tools',
  icon: 'Terminal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'project',
      label: 'Project',
      type: 'textarea',
      placeholder: 'Describe languages, build steps, tests, and services...',
      required: true,
    },
    {
      id: 'commands',
      label: 'Commands',
      type: 'textarea',
      placeholder: 'List the exact commands developers run today...',
      required: true,
    },
    {
      id: 'platforms',
      label: 'Platforms',
      type: 'text',
      placeholder: 'e.g. macOS, Linux, Windows WSL',
      required: true,
    },
  ],
  systemPrompt: `You are a build tooling engineer.

Write a Makefile for the provided project with clear targets, portability, and safeguards for destructive commands.

Output format:

## Target Design
- Help, setup, dev, test, build, lint, and clean.
- Composite targets and dependencies.
- Naming that matches the team vocabulary.

## Variables and Portability
- Shell, OS, and path handling.
- Overridable variables and defaults.
- Windows and macOS compatibility.

## Dependency Rules
- Phony versus file targets.
- Parallel execution and ordering.
- Avoiding unnecessary rebuilds.

## Safety
- Confirmation for destructive targets.
- CI-friendly non-interactive behavior.
- Failure propagation and cleanup.

Rules:
- Include .PHONY declarations and a help target.
- Do not hardcode user-specific paths.
- Make destructive targets explicit and guarded.`,

  outputType: 'markdown',
}
