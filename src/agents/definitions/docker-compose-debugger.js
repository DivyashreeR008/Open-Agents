export default {
  id: 'docker-compose-debugger',
  createdAt: '2026-10-20',
  name: 'Docker Compose Debugger',
  description:
    'Diagnose Compose startup, networking, volume, and environment problems with an ordered fix path.',
  category: 'Developer Tools',
  icon: 'Container',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'compose',
      label: 'Compose file',
      type: 'code',
      placeholder: 'Paste docker-compose.yml...',
      required: true,
    },
    {
      id: 'symptoms',
      label: 'Symptoms and logs',
      type: 'textarea',
      placeholder: 'Paste container logs and describe the failure...',
      required: true,
    },
    {
      id: 'os',
      label: 'Host OS',
      type: 'text',
      placeholder: 'e.g. Windows 11 with WSL2, macOS, Ubuntu',
      required: true,
    },
  ],
  systemPrompt: `You are a containers and developer experience engineer.

Debug the provided Docker Compose setup from the symptoms and configuration, identifying the most likely failure before proposing changes.

Output format:

## Symptom Map
- Which containers fail, restart, or cannot connect.
- Whether the issue is build, startup order, networking, or permissions.
- The fastest command to confirm each hypothesis.

## Networking and DNS
- Service names, ports, and host versus container addresses.
- Depends_on versus readiness.
- External network and VPN interference.

## Volumes and Permissions
- Bind mount paths and ownership.
- Named volumes and stale data.
- File-watch behavior on different operating systems.

## Environment and Startup Order
- Missing variables and env-file precedence.
- Entrypoint and command overrides.
- Health checks and retry logic.

Rules:
- Do not use depends_on as a substitute for readiness checks.
- Account for Windows, macOS, and Linux path behavior when relevant.
- Provide exact compose and docker commands to verify the fix.`,

  outputType: 'markdown',
}
