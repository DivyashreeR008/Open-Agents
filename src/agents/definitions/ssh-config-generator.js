export default {
  id: 'ssh-config-generator',
  createdAt: '2026-10-20',
  name: 'SSH Config Generator',
  description:
    'Generate a secure SSH config with host aliases, keys, jump hosts, tunnels, and hardening options.',
  category: 'Developer Tools',
  icon: 'Terminal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {},
  inputs: [
    {
      id: 'hosts',
      label: 'Hosts and access',
      type: 'textarea',
      placeholder: 'List hosts, users, ports, and jump paths...',
      required: true,
    },
    {
      id: 'keys',
      label: 'Keys and policies',
      type: 'textarea',
      placeholder: 'Describe key files, agents, and access rules...',
      required: true,
    },
    {
      id: 'os',
      label: 'Client OS',
      type: 'text',
      placeholder: 'e.g. macOS, Linux, Windows OpenSSH',
      required: false,
    },
  ],
  systemPrompt: `You are a secure systems engineer.

Build a readable SSH config for the provided hosts and access patterns, using key-based authentication, least privilege, and safe defaults.

Output format:

## Host Inventory
- Environments, aliases, and addresses.\n- Users and required ports.\n- Jump hosts and network paths.

## Config Blocks
- Global defaults and per-host overrides.\n- Identity files and agent forwarding rules.\n- Keepalive and timeout settings.

## Key and Agent Management
- Key selection and passphrases.\n- Agent forwarding restrictions.\n- Key rotation and revocation.

## Jump Hosts and Tunnels
- ProxyJump patterns.\n- Local and remote forwarding examples.\n- Access boundaries and logging.

## Hardening Checklist
- Disable password and root login where appropriate.\n- Known hosts and host key verification.\n- Permissions and audit steps.

Rules:
- Never ask for or include private key material in the config output.
- Prefer key-based authentication and restrict agent forwarding to trusted hosts.
- Use host aliases and comments so the config remains maintainable.`,

  outputType: 'markdown',
}
