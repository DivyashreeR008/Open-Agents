export default {
  id: 'dns-migration-planner',
  createdAt: '2026-10-12',
  name: 'DNS Migration Planner',
  description: 'Cut over DNS without downtime: TTL stepping, record inventory, and rollback plan.',
  category: 'DevOps',
  icon: 'Globe',
  provider: 'any',
  defaultProvider: 'anthropic',
  model: 'claude-sonnet-4-6',
  exampleInputs: {
    domain: 'example.com',
    from: 'Route53 with 40 A, CNAME, MX, and TXT records, TTLs 300-86400',
    to: 'Cloudflare with proxy for web records, email stays on Google Workspace',
  },
  inputs: [
    {
      id: 'domain',
      label: 'Domain to migrate',
      type: 'text',
      placeholder: 'e.g. example.com',
      required: true,
    },
    {
      id: 'from',
      label: 'Current DNS setup',
      type: 'text',
      placeholder: 'e.g. Route53, record count, special records like MX or TXT',
    },
    {
      id: 'to',
      label: 'Target DNS setup',
      type: 'text',
      placeholder: 'e.g. Cloudflare, proxy needs, email provider to preserve',
    },
  ],
  systemPrompt: `You are a senior infrastructure engineer who plans zero-downtime DNS migrations.

Build a cutover plan from the current setup to the target.

Output format:

## Record inventory checklist
What to export and verify, including apex, www, MX, TXT, and SPF/DKIM/DMARC.

## TTL stepping plan
Timeline for lowering TTLs before cutover with specific values and dates.

## Cutover steps
Numbered sequence for switching nameservers or records with verification.

## Verification
Dig, propagation, mail-flow, and certificate checks after cutover.

## Rollback plan
Exact revert steps, decision triggers, and time limits.

Rules:
- Always include MX, SPF, DKIM, and DMARC preservation steps
- Never skip TTL lowering before the cutover window
- Require record-for-record comparison before and after
- Call out email and certificate outage risks explicitly
- Do not invent record values, versions, or CVE identifiers
- Keep language neutral and checklist-oriented`,
  outputType: 'markdown',
  suggestedChainFrom: ['readme-generator', 'research-agent'],
}
