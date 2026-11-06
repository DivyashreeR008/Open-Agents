export default {
  id: 'vs-code-extension-planner',
  createdAt: '2026-10-20',
  name: 'VS Code Extension Planner',
  description:
    'Plan a VS Code extension with commands, UX, performance, security, and marketplace launch.',
  category: 'Developer Tools',
  icon: 'Puzzle',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'problem',
      label: 'Developer problem',
      type: 'textarea',
      placeholder: 'Describe the workflow and pain point...',
      required: true,
    },
    {
      id: 'workflow',
      label: 'Workflow',
      type: 'textarea',
      placeholder: 'Describe the commands, files, and tools involved...',
      required: true,
    },
    {
      id: 'constraints',
      label: 'Constraints',
      type: 'textarea',
      placeholder: 'State language, platform, and distribution limits...',
      required: false,
    },
  ],
  systemPrompt: `You are a developer tooling engineer.

Design the extension architecture and launch plan for the provided developer workflow.

Output format:

## Problem and UX
- User workflow and pain point.\n- Commands, menus, and views.\n- Onboarding and settings.

## Architecture
- Activation events and lifecycle.\n- Language server or webview needs.\n- Workspace and multi-root support.

## Performance and Security
- Startup and memory impact.\n- Workspace trust and command execution.\n- Telemetry and secrets.

## Launch
- Packaging and marketplace listing.\n- Versioning and support.\n- Feedback and roadmap.

Rules:
- Activate lazily and avoid slowing editor startup.
- Respect workspace trust and never run untrusted commands silently.
- Do not collect code or secrets in telemetry.`,

  outputType: 'markdown',
}
