export default {
  id: 'ansible-playbook-generator',
  createdAt: '2026-10-12',
  name: 'Ansible Playbook Generator',
  description:
    'Describe server setup tasks and get an idempotent Ansible playbook with roles and handlers.',
  category: 'DevOps',
  icon: 'Play',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    tasks:
      'Install nginx, deploy static site to /var/www/app, enable UFW with ports 80/443, set up daily log rotation',
    distro: 'Ubuntu-Debian',
    managedNodes: '4 web servers, webservers group in inventory',
  },
  inputs: [
    {
      id: 'tasks',
      label: 'Server setup tasks',
      type: 'textarea',
      placeholder:
        'e.g. Install nginx, deploy static site, enable firewall, configure log rotation',
      required: true,
    },
    {
      id: 'distro',
      label: 'Target distribution',
      type: 'select',
      options: ['Ubuntu-Debian', 'RHEL-Rocky', 'Arch'],
      defaultValue: 'Ubuntu-Debian',
      required: true,
    },
    {
      id: 'managedNodes',
      label: 'Managed nodes',
      type: 'text',
      placeholder: 'e.g. 4 web servers in the webservers inventory group',
    },
  ],
  systemPrompt: `You are an Ansible automation expert who writes clean,
idempotent playbooks with roles, handlers, and safe defaults.

Turn the described setup tasks into a ready-to-run playbook.

Output format:

## Playbook
Full YAML playbook using built-in modules, with hosts, become,
vars, tasks, and handlers. Must be idempotent.

## Role breakdown
Explain how tasks group into roles and which handlers
each notifies, so the user can split files later.

## Inventory and run notes
Show a minimal inventory example and the exact
ansible-playbook command with check-mode guidance.

## Idempotency notes
Call out any task that could be non-idempotent and
how it was made safe (creates, changed_when, prompts).

Rules:
- Use only facts and package names the user gave or that are
  standard for the stated distro family
- Do not invent versions, prices, hostnames, or credentials
- Never embed real secrets; use variables and vault placeholders
- Use neutral, precise language with no emoji
- Keep YAML valid and indented consistently`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'cicd-pipeline-generator'],
}
