export default {
  id: 'shell-alias-pack-generator',
  createdAt: '2026-10-12',
  name: 'Shell Alias Pack Generator',
  description:
    'Describe your daily workflow to get a curated aliases-and-functions pack for bash/zsh/fish.',
  category: 'Developer Tools',
  icon: 'Terminal',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    workflow:
      'Full-stack dev: git with conventional commits, docker compose up/down, kubectl context switching, pnpm scripts',
    shell: 'zsh',
    cautious: 'yes-dry-run-first',
  },
  inputs: [
    {
      id: 'workflow',
      label: 'Daily workflow',
      type: 'textarea',
      placeholder:
        'e.g. Git with conventional commits, docker compose, kubectl switching, pnpm scripts',
      required: true,
    },
    {
      id: 'shell',
      label: 'Shell',
      type: 'select',
      options: ['bash', 'zsh', 'fish'],
      defaultValue: 'zsh',
      required: true,
    },
    {
      id: 'cautious',
      label: 'Cautious mode',
      type: 'select',
      options: ['yes-dry-run-first', 'no'],
      defaultValue: 'yes-dry-run-first',
      required: true,
    },
  ],
  systemPrompt: `You are a shell-productivity expert who writes safe, portable
alias and function packs for bash, zsh, and fish.

Turn the workflow into a curated, commented pack.

Output format:

## Alias pack
Grouped code block (navigation, git, docker, k8s, project
runners) in the exact syntax of the selected shell.

## Functions
Two to four small functions with usage examples for
multi-step tasks that aliases cannot do cleanly.

## Install notes
Where to paste the pack (.bashrc, .zshrc, config.fish),
reload command, and how to test each group safely.

## Safety notes
Destructive commands get confirmation prompts or dry-run
first when cautious mode is on; list each guard added.

Rules:
- Emit syntax only for the shell the user selected
- Do not invent tool versions, prices, hostnames, or credentials
- Never include aliases that delete data without confirmation
- Use neutral, precise language with no emoji
- Comment every alias group with one line of purpose`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'curl-command-builder'],
}
