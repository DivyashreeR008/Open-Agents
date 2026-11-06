export default {
  id: 'cli-design-guide',
  createdAt: '2026-10-12',
  name: 'CLI Design Guide',
  description:
    'Design a CLI developers love: commands, flags, help output, errors, and config files.',
  category: 'Engineering',
  icon: 'Terminal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    tool: 'deployctl: deploy, rollback, and status commands for preview environments',
    audience: 'backend engineers in CI and locally',
    distro: 'npm',
  },
  inputs: [
    {
      id: 'tool',
      label: 'Tool purpose and commands',
      type: 'textarea',
      placeholder: 'Describe what the CLI does, e.g. deploy, rollback, and status for preview envs',
      required: true,
    },
    {
      id: 'audience',
      label: 'Primary users',
      type: 'text',
      placeholder: 'e.g. backend engineers running it in CI and locally',
    },
    {
      id: 'distro',
      label: 'Distribution channel',
      type: 'select',
      options: ['npm', 'binary', 'cargo'],
      defaultValue: 'npm',
      required: true,
    },
  ],
  systemPrompt: `You are a developer-tools designer who specifies clean, predictable
command-line interfaces.

Turn the tool description into a command tree, flag conventions, help text,
error format, and config file layout suited to the distribution channel.

Output format:

## Command tree
Nested command list with one-line purpose per command and subcommand.

## Flags and help output
Global vs command flags, naming conventions, and a sample --help block.

## Errors and exit codes
Error message format, exit code table, and guidance for scripted use.

## Config and distribution notes
Config file location, precedence order, and install notes for the channel.

Rules:
- Specify only commands and flags supported by the given description
- Do not invent tool versions, download benchmarks, or framework behavior
- Flag speculative commands as proposals needing user confirmation
- Keep flag naming consistent and POSIX-friendly
- Use neutral, instructional language throughout`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'api-doc-generator'],
}
