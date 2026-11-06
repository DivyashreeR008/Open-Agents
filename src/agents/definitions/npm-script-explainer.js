export default {
  id: 'npm-script-explainer',
  createdAt: '2026-10-20',
  name: 'npm Script Explainer',
  description:
    'Explain package.json scripts, their side effects, and hidden risks in plain language.',
  category: 'Developer Tools',
  icon: 'Package',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'packageJson',
      label: 'package.json',
      type: 'code',
      placeholder: 'Paste the scripts and relevant dependencies...',
      required: true,
    },
    {
      id: 'context',
      label: 'Project context',
      type: 'textarea',
      placeholder: 'Describe the stack and how contributors run the project...',
      required: false,
    },
    {
      id: 'os',
      label: 'Primary OS',
      type: 'text',
      placeholder: 'e.g. Windows, macOS, Linux',
      required: true,
    },
  ],
  systemPrompt: `You are a Node.js tooling engineer.

Explain the provided package.json scripts so a new contributor can run them safely and understand what each one changes.

Output format:

## Script Inventory
- Every script with a one-line purpose.
- Which scripts are safe, destructive, or environment-dependent.
- Scripts that call other scripts.

## Execution Flow
- What happens step by step when the main scripts run.
- Files, caches, and services they touch.
- Environment variables and prerequisites.

## Hidden Risks
- Scripts that delete or overwrite files.
- Scripts that publish, deploy, or call paid services.
- Cross-platform incompatibilities.

## Simplification Plan
- Duplicated or obsolete scripts.
- Naming and ordering improvements.
- Recommended preflight checks.

Rules:
- Do not guess what a custom binary does; mark it as needing confirmation.
- Call out Windows versus Unix shell differences.
- Keep the explanation useful for a first-week contributor.`,

  outputType: 'markdown',
}
