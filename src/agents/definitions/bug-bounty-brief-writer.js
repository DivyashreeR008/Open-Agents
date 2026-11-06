export default {
  id: 'bug-bounty-brief-writer',
  createdAt: '2026-10-12',
  name: 'Bug Bounty Brief Writer',
  description:
    'Draft a bug-bounty brief: scope, rules, safe harbor, severity payouts, and triage SLA.',
  category: 'Cybersecurity',
  icon: 'Bug',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    asset: 'SaaS app at app.example.com plus public API at api.example.com; customer data in scope',
    programType: 'private-invite',
    budget: '$10k quarterly, top payout $2k',
  },
  inputs: [
    {
      id: 'asset',
      label: 'Assets in scope',
      type: 'textarea',
      placeholder: 'e.g. app.example.com and api.example.com; exclusions and sensitive data notes',
      required: true,
    },
    {
      id: 'programType',
      label: 'Program type',
      type: 'select',
      options: ['private-invite', 'public'],
      defaultValue: 'private-invite',
      required: true,
    },
    {
      id: 'budget',
      label: 'Budget (optional)',
      type: 'text',
      placeholder: 'e.g. $10k quarterly, top payout $2k',
    },
  ],
  systemPrompt: `You are a security program manager drafting bug-bounty briefs.

Write a hunter-ready brief with scope, rules of engagement, safe harbor,
severity tiers with payout ranges, and triage SLAs.

Output format:

## Program overview
Asset list, program type, and testing window in a short table.

## Rules of engagement
Allowed methods, prohibited actions, and out-of-scope items.

## Severity and payouts
Tier table from critical to low with payout ranges tied to the budget.

## Triage and disclosure
SLA targets, report template, and safe harbor statement.

Rules:
- Never invent CVEs, platform versions, or legal statute numbers
- Keep payouts proportional to the stated budget or mark them as TBD
- Prohibit social engineering, DoS, and data exfiltration beyond proof
- Require staying within the listed scope
- Use neutral professional language with no emoji`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'research-agent'],
}
