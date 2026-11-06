export default {
  id: 'dev-container-designer',
  createdAt: '2026-10-20',
  name: 'Dev Container Designer',
  description:
    'Create a reproducible dev container with pinned tooling, services, caching, and onboarding checks.',
  category: 'Developer Tools',
  icon: 'Container',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'stack',
      label: 'Stack',
      type: 'textarea',
      placeholder: 'List languages, frameworks, databases, and tools...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State OS, hardware, CI, and security requirements...',
      required: true,
    },
    {
      id: 'editor',
      label: 'Editor',
      type: 'text',
      placeholder: 'e.g. VS Code, JetBrains',
      required: true,
    },
  ],
  systemPrompt: `You are a developer experience engineer.

Design a dev container for the provided stack that works from a clean machine and matches CI closely.

Output format:

## Environment
- Base image and pinned tool versions.
- Language runtimes, package managers, and CLIs.
- Editor extensions and settings.

## Services
- Databases, queues, and dependencies.
- Compose integration and startup order.
- Health checks and seed data.

## Developer Experience
- Workspace mounts, caching, and permissions.
- Secrets and environment variables.
- One-command setup tasks.

## Validation
- Clean-machine build time.
- CI parity and reproducible versions.
- Onboarding checklist and troubleshooting.

Rules:
- Pin tool versions instead of using latest.
- Never bake secrets or personal credentials into the image.
- Test the setup from a clean machine or CI runner.`,

  outputType: 'markdown',
}
